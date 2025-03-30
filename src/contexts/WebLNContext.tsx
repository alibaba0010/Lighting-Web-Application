"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { requestProvider, WebLNProvider } from "webln";

interface WebLNContextType {
  provider: WebLNProvider | null;
  isEnabled: boolean;
  error: string | null;
  connecting: boolean;
}

const WebLNContext = createContext<WebLNContextType>({
  provider: null,
  isEnabled: false,
  error: null,
  connecting: false,
});

export const useWebLN = () => useContext(WebLNContext);

export const WebLNProviderComponent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [provider, setProvider] = useState<WebLNProvider | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const initializeWebLN = async () => {
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

    initializeWebLN();
  }, []);

  return (
    <WebLNContext.Provider value={{ provider, isEnabled, error, connecting }}>
      {children}
    </WebLNContext.Provider>
  );
};
