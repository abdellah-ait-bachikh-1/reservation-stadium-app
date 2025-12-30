export function isError(error: unknown): error is Error {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    error instanceof Error
  );
}
export function isFieldHasError(
  validationErrors: Record<string, string[]> | null,
  field: string
): boolean {
  if (!validationErrors) return false;
  return !!validationErrors[field] && validationErrors[field].length > 0;
}

export function haveSameValues<T extends Record<string, any>>(
  obj1: T,
  obj2: T,
  keys: Array<keyof T>
): boolean {
  return keys.every(key => {
    const val1 = obj1[key];
    const val2 = obj2[key];
    
    // Handle null/undefined cases
    if (val1 === null || val1 === undefined || val2 === null || val2 === undefined) {
      return val1 === val2;
    }
    
    // Deep comparison for objects and arrays
    return JSON.stringify(val1) === JSON.stringify(val2);
  });
}
