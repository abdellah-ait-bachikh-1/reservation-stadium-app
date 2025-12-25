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