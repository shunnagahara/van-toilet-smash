type ErrorResponse<T> = {
  data: T | null;
  error: Error | null;
};

/**
 * Handles Supabase errors by converting unknown error types into a standardized ErrorResponse format.
 * @template T - The expected data type
 * @param error - The caught error of unknown type
 * @returns {ErrorResponse<T>} Standardized error response with null data and formatted error
 */
export const handleSupabaseError = <T>(error: unknown): ErrorResponse<T> => {
  const err = error instanceof Error ? error : new Error('Unknown error occurred');
  return { data: null, error: err };
};

/**
 * Generic try-catch wrapper for async operations that returns a standardized ErrorResponse.
 * @template T - The expected return type of the operation
 * @param operation - Async function to be executed
 * @returns {Promise<ErrorResponse<T>>} Standardized response containing either data or error
 * @example
 * const result = await handleTryCatch(async () => {
 *   return await supabase.from('users').select('*');
 * });
 */
export const handleTryCatch = async <T>(
  operation: () => Promise<T>
): Promise<ErrorResponse<T>> => {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
}; 