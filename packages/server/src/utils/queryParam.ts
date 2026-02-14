/**
 * Safely extracts a query parameter as a string.
 * In Express 5, query params can be string | string[] | undefined.
 * This helper normalizes to string | undefined.
 */
export const queryString = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

/**
 * Safely extracts a query parameter as a string, with a default value.
 */
export const queryStringOrDefault = (
  value: string | string[] | undefined,
  defaultValue: string
): string => {
  return queryString(value) ?? defaultValue;
};
