"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface LoadingContextType {
  /** Whether the global loading overlay is visible */
  isLoading: boolean;
  /** Optional message shown below the spinner */
  loadingMessage: string | undefined;
  /** Show the global full-screen spinner. Pass a message to display below the spinner. */
  setLoading: (loading: boolean, message?: string) => void;
  /** Convenience: set loading true with an optional message */
  showLoading: (message?: string) => void;
  /** Convenience: set loading false */
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();

  const setLoading = useCallback((loading: boolean, message?: string) => {
    setIsLoading(loading);
    setLoadingMessage(loading ? message : undefined);
  }, []);

  const showLoading = useCallback((message?: string) => {
    setLoading(true, message);
  }, [setLoading]);

  const hideLoading = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingMessage,
        setLoading,
        showLoading,
        hideLoading,
      }}
    >
      {children}
      {isLoading && (
        <LoadingSpinner
          variant="fullScreen"
          size="lg"
          text={loadingMessage}
        />
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

/** Optional: use when LoadingProvider might not be present. Returns undefined outside provider. */
export function useLoadingOptional(): LoadingContextType | undefined {
  return useContext(LoadingContext);
}
