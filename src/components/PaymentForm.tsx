import React, { useState } from "react";
import { useWebLNPayments } from "../hooks/useWebLNPayments";
import { QrReader } from "react-qr-reader";

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
      const sats = parseFloat(value);
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
      const fiat = parseFloat(value);
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
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Send Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount (sats)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter amount in sats"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount (USD)
          </label>
          <input
            type="number"
            value={fiatAmount}
            onChange={(e) => handleFiatChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter amount in USD"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Lightning Invoice
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="text"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter Lightning invoice"
            />
            <button
              type="button"
              onClick={() => setShowScanner(!showScanner)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Scan QR
            </button>
          </div>
        </div>

        {showScanner && (
          <div className="mt-4">
            <QrReader
              onResult={handleScan}
              constraints={{ facingMode: "environment" }}
              className="w-full max-w-sm mx-auto"
            />
          </div>
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={!invoice || loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Send Payment"}
        </button>
      </form>
    </div>
  );
};
