import { useFocusEffect } from "@react-navigation/native";
import { DependencyList, useCallback, useState } from "react";

export type UseAsyncFocusedParameters<Response> = {
  action: () => Promise<Response>;
  dependencies: DependencyList;
};

export type UseAsyncFocusedParametersReturnValue<Response> = {
  loading: boolean;
  response?: Response;
  error?: Error;
};

export const useAsyncFocused = <Response>(
  parameters: UseAsyncFocusedParameters<Response>
): UseAsyncFocusedParametersReturnValue<Response> => {
  const { action, dependencies } = parameters;

  const [response, setResponse] = useState<Response>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  const callback = useCallback(() => {
    let isActive = true;

    const fetch = async () => {
      if (isActive) {
        setLoading(true);
      }

      try {
        const response = await action();
        if (isActive) {
          setResponse(response);
        }
      } catch (error) {
        if (isActive) {
          setError(error as Error);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetch();

    return () => {
      isActive = false;
    };
  }, dependencies);

  useFocusEffect(callback);

  return { response, loading, error };
};
