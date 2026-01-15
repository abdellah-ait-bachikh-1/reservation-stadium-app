// hooks/useFormValidation.ts
import { useState, useCallback, useRef } from "react";
import { LocaleEnumType } from "@/types";

export interface ValidationErrors {
  [key: string]: string[] | undefined;
}

export interface ValidationFunction<T> {
  (locale: LocaleEnumType, formData: T): {
    data: T | null;
    validationErrors: ValidationErrors | null;
  };
}

export const useFormValidation = <T extends Record<string, any>>(
  validationFn: ValidationFunction<T>,
  locale: LocaleEnumType = "fr"
) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isBackendValidationError,setIsBackendValidationError] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const setErrorsState = useCallback((newErrors: ValidationErrors) => {
    setErrors(newErrors);
    Object.entries(newErrors).forEach(([field, errors]) => {
      if (errors && errors.length > 0) {
        markAsTouched(field);
      }
    });
  }, []);
  // Get ALL error messages for a field
  const getErrorMessages = useCallback(
    (field: string): string[] | null => {
      if (!errors[field] || !touched[field]) return null;
      return errors[field] || null;
    },
    [errors, touched]
  );

  // Check if field has any errors
  const hasError = useCallback(
    (field: string): boolean => {
      return !!errors[field] && errors[field]!.length > 0 && touched[field];
    },
    [errors, touched]
  );

  // Validate single field with debounce
  const validateField = useCallback(
    (field: keyof T, value: any, formData: T) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        const testData = { ...formData, [field]: value };
        const { validationErrors } = validationFn(locale, testData);

        // Type assertion to fix the error
        const fieldStr = field as string;
        const errors = validationErrors as ValidationErrors;

        setErrors((prev) => ({
          ...prev,
          [fieldStr]: errors?.[fieldStr],
        }));
      }, 30);
    },
    [locale, validationFn]
  );

  // Validate entire form
  const validateForm = useCallback(
    (formData: T) => {
      const { validationErrors } = validationFn(locale, formData);
      setErrors(validationErrors || {});
      return !validationErrors; // returns true if no errors
    },
    [locale, validationFn]
  );

  // Mark field as touched
  const markAsTouched = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Get all fields with errors
  const getAllErrorFields = useCallback((): string[] => {
    return Object.keys(errors).filter(
      (field) => errors[field] && errors[field]!.length > 0
    );
  }, [errors]);

  // Check if form has any errors
  const hasFormErrors = useCallback((): boolean => {
    return Object.keys(errors).some(
      (field) => errors[field] && errors[field]!.length > 0
    );
  }, [errors]);

  // Get total error count
  const getErrorCount = useCallback((): number => {
    return Object.values(errors).reduce((total, fieldErrors) => {
      return total + (fieldErrors?.length || 0);
    }, 0);
  }, [errors]);

  // Reset validation state
  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    isBackendValidationError,
    touched,
    setErrorsState,
    hasError,
    getErrorMessages,
    validateField,
    validateForm,
    markAsTouched,
    getAllErrorFields,
    hasFormErrors,
    getErrorCount,
    resetValidation,
    setIsBackendValidationError
  };
};
