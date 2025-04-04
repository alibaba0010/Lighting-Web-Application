"use client";

import type React from "react";

import { useState } from "react";
import { useWebLNPayments } from "../hooks/useWebLNPayments";
import { QrReader } from "react-qr-reader";
import { BoltIcon } from "@heroicons/react/24/outline";

export const PaymentForm: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [invoice, setInvoice] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [fiatAmount, setFiatAmount] = useState("");
  const { sendPayment, convertSatsToFiat, convertFiatToSats, loading, error } =
    useWebLNPayments();

  const handleAmountChange = async (value: string) => {
    setAmount(value);
    if (value) {
      const sats = Number.parseFloat(value);
      if (!isNaN(sats)) {
        const fiat = await convertSatsToFiat(sats);
        setFiatAmount(fiat.toFixed(2));
      }
    } else {
      setFiatAmount("");
    }
  };

  const handleFiatChange = async (value: string) => {
    setFiatAmount(value);
    if (value) {
      const fiat = Number.parseFloat(value);
      if (!isNaN(fiat)) {
        const sats = await convertFiatToSats(fiat);
        setAmount(sats.toString());
      }
    } else {
      setAmount("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (invoice) {
      await sendPayment(invoice);
      setInvoice("");
      setAmount("");
      setFiatAmount("");
    }
  };

  const handleScan = (result: any) => {
    if (result?.text) {
      setInvoice(result.text);
      setShowScanner(false);
    }
  };

  return (
    <div className="p-6 bg-card rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <BoltIcon className="h-5 w-5 mr-2" />
        Send Payment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Amount (sats)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Amount (USD)</label>
          <input
            type="number"
            value={fiatAmount}
            onChange={(e) => handleFiatChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="0.01"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Lightning Invoice
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter Lightning Invoice"
            />
            <button
              type="button"
              onClick={() => setShowScanner(!showScanner)}
              className="whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Scan QR
            </button>
          </div>
        </div>

        {showScanner && (
          <div className="mt-4 bg-background p-4 rounded-lg">
            <QrReader
              onResult={handleScan}
              constraints={{ facingMode: "environment" }}
              className="w-full max-w-sm mx-auto"
            />
          </div>
        )}

        {error && <div className="text-destructive text-sm">{error}</div>}

        <button
          type="submit"
          disabled={!invoice || loading}
          className="w-full py-2 px-4 mt-2 rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Send Payment"}
        </button>
      </form>
    </div>
  );
};
