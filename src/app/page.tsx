"use client";

import { useState } from "react";
import { WalletInfo } from "../components/WalletInfo";
import { PaymentForm } from "../components/PaymentForm";
import { ScrollPayment } from "../components/ScrollPayment";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const { theme, setTheme } = useTheme();

  return (
    <main className="min-h-screen p-8 transition-colors duration-200 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold dark:text-white">
            ⚡ Lightning Web App
          </h1>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === "dark" ? (
              <SunIcon className="h-6 w-6 text-yellow-500" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <WalletInfo />
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">
                Recipient Settings
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lightning Address
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter recipient's Lightning address"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
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
