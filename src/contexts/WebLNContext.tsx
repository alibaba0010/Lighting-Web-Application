"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { requestProvider, type WebLNProvider } from "webln";

interface WebLNContextType {
  provider: WebLNProvider | null;
  isEnabled: boolean;
  error: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
}

const WebLNContext = createContext<WebLNContextType>({
  provider: null,
  isEnabled: false,
  error: null,
  connecting: false,
  connect: async () => {},
});

export const useWebLN = () => useContext(WebLNContext);

export const WebLNProviderComponent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [provider, setProvider] = useState<WebLNProvider | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);

  // Use useCallback to memoize the connect function
  const connect = useCallback(async () => {
    // If already connected or currently connecting, don't try again
    if (isEnabled || connecting) return;

    try {
      setConnecting(true);
      setError(null);
      const weblnProvider = await requestProvider();
      setProvider(weblnProvider);
      setIsEnabled(true);
      setHasAttemptedConnection(true);
    } catch (e) {
      setError(
        "Failed to connect to a Lightning wallet. Please install a WebLN-compatible wallet."
      );
      setHasAttemptedConnection(true);
    } finally {
      setConnecting(false);
    }
  }, [isEnabled, connecting]);

  const contextValue = {
    provider,
    isEnabled,
    error,
    connecting,
    connect,
  };

  return (
    <WebLNContext.Provider value={contextValue}>
      {children}
    </WebLNContext.Provider>
  );
};
