import { useFocusEffect } from "@react-navigation/native";
import { DependencyList, useCallback, useState } from "react";

export type UseAsyncFocusedParameters<Response> = {
  action: () => Promise<Response>;
  dependencies: DependencyList;
  onError?: (error: Error) => void;
};

export type UseAsyncFocusedParametersReturnValue<Response> = {
  loading: boolean;
  response?: Response;
  error?: Error;
  refetch: () => void;
};

export const useAsyncFocused = <Response>(
  parameters: UseAsyncFocusedParameters<Response>
): UseAsyncFocusedParametersReturnValue<Response> => {
  const { action, dependencies, onError } = parameters;

  const [response, setResponse] = useState<Response>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      const response = await action();
      setResponse(response);
    } catch (error) {
      setError(error as Error);
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      if (isActive) {
        fetch();
      }

      return () => {
        isActive = false;
      };
    }, [fetch])
  );

  return { response, loading, error, refetch: fetch };
};
