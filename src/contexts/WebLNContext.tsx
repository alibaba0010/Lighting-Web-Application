"use client";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
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

  const connect = async () => {
    if (isEnabled) return;

    try {
      setConnecting(true);
      setError(null);
      const weblnProvider = await requestProvider();
      setProvider(weblnProvider);
      setIsEnabled(true);
    } catch (e) {
      setError(
        "Failed to connect to a Lightning wallet. Please install a WebLN-compatible wallet."
      );
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    // Try to connect automatically on load
    connect();
  }, []);

  return (
    <WebLNContext.Provider
      value={{ provider, isEnabled, error, connecting, connect }}
    >
      {children}
    </WebLNContext.Provider>
  );
};
