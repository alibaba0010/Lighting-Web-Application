"use client";

import { useState } from "react";
import { WalletInfo } from "../components/WalletInfo";
import { PaymentForm } from "../components/PaymentForm";
import { ScrollPayment } from "../components/ScrollPayment";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, BoltIcon } from "@heroicons/react/24/outline";
import { useWebLN } from "../contexts/WebLNContext";

export default function Home() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const { theme, setTheme } = useTheme();
  const { provider, isEnabled, connecting, error } = useWebLN();

  const handleConnectWallet = async () => {
    // This will trigger the WebLN connection if not already connected
    // The actual connection logic is in the WebLNContext
    window.location.reload();
  };

  return (
    <main className="min-h-screen p-4 md:p-8 transition-colors duration-200 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            ⚡ Lightning Web App
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleConnectWallet}
              className="flex items-center px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              disabled={connecting}
            >
              <BoltIcon className="h-5 w-5 mr-1" />
              {isEnabled
                ? "Wallet Connected"
                : connecting
                ? "Connecting..."
                : "Connect Wallet"}
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5 text-yellow-500" />
              ) : (
                <MoonIcon className="h-5 w-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6 md:space-y-8">
            <WalletInfo />
            <div className="p-6 bg-card rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-6">Recipient Settings</h2>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lightning Address
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter recipient's Lightning address"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <PaymentForm />
            {recipientAddress && (
              <ScrollPayment
                recipientAddress={recipientAddress}
                amountPerScroll={1}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
