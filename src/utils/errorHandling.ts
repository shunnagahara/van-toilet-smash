type ErrorResponse<T> = {
  data: T | null;
  error: Error | null;
};

export const handleSupabaseError = <T>(error: unknown): ErrorResponse<T> => {
  const err = error instanceof Error ? error : new Error('Unknown error occurred');
  return { data: null, error: err };
};

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