import { useEffect, useState } from "react";

export type UseAsyncParameters<Response> = {
  action: () => Promise<Response>;
};

export type UseAsyncParametersReturnValue<Response> = {
  refetch: () => Promise<void>;
  loading: boolean;
  response?: Response;
  error?: Error;
};

export const useAsync = <Response>(
  parameters: UseAsyncParameters<Response>
): UseAsyncParametersReturnValue<Response> => {
  const { action } = parameters;

  const [response, setResponse] = useState<Response>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  const fetch = async () => {
    setLoading(true);

    try {
      const response = await action();
      setResponse(response);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { refetch: fetch, response, loading, error };
};
