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
    <div className="p-6 bg-card-background text-card-foreground rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <BoltIcon className="h-6 w-6 text-primary mr-2" />
        Send Payment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">
            Amount (sats)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter amount in sats"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">
            Amount (USD)
          </label>
          <input
            type="number"
            value={fiatAmount}
            onChange={(e) => handleFiatChange(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter amount in USD"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">
            Lightning Invoice
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="text"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter Lightning invoice"
            />
            <button
              type="button"
              onClick={() => setShowScanner(!showScanner)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
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
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-muted disabled:text-muted-foreground"
        >
          {loading ? "Processing..." : "Send Payment"}
        </button>
      </form>
    </div>
  );
};
