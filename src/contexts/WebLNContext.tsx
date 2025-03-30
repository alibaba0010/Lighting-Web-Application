"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { requestProvider, WebLNProvider } from "webln";
import { getWebLNProvider } from "@getalby/sdk";

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

        // Try to get Alby provider first
        try {
          const albyProvider = await getWebLNProvider();
          if (albyProvider) {
            setProvider(albyProvider);
            setIsEnabled(true);
            setConnecting(false);
            return;
          }
        } catch (e) {
          console.log("Alby provider not available, falling back to WebLN");
        }

        // Fall back to WebLN
        const weblnProvider = await requestProvider();
        setProvider(weblnProvider);
        setIsEnabled(true);
      } catch (e) {
        setError(
          "Failed to connect to a Lightning wallet. Please install Alby or another WebLN-compatible wallet."
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
