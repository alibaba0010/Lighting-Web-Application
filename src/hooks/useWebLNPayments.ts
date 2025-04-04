import { useState } from "react";
import { useWebLN } from "../contexts/WebLNContext";
import {
  RequestInvoiceArgs,
  SendPaymentResponse,
  GetInfoResponse,
} from "webln";

// Current BTC price in USD (this should be fetched from an API in production)
const BTC_PRICE_USD = 65000;
const SATS_PER_BTC = 100000000;

export const useWebLNPayments = () => {
  const { provider, isEnabled } = useWebLN();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendPayment = async (
    paymentRequest: string
  ): Promise<SendPaymentResponse | null> => {
    if (!provider || !isEnabled) {
      setError("WebLN provider wallet not available or connected");
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Sending payment:", paymentRequest);
      const response = await provider.sendPayment(paymentRequest);
      console.log("Payment response:", response);
      return response;
    } catch (e: any) {
      setError(e.message || "Failed to send payment");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const keysend = async (
    destination: string,
    amount: number
  ): Promise<void> => {
    if (!provider || !isEnabled) {
      setError("WebLN provider wallet not available or connected");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await provider.keysend({
        destination,
        amount,
      });
    } catch (e: any) {
      setError(e.message || "Failed to send keysend payment");
    } finally {
      setLoading(false);
    }
  };

  const getInfo = async (): Promise<GetInfoResponse | null> => {
    if (!provider || !isEnabled) {
      setError("WebLN provider wallet not available or connected");
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const info = await provider.getInfo();
      return info;
    } catch (e: any) {
      setError(e.message || "Failed to get wallet info");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const makeInvoice = async (
    args: RequestInvoiceArgs
  ): Promise<string | null> => {
    if (!provider || !isEnabled) {
      setError("WebLN provider wallet not available or connected");
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const { paymentRequest } = await provider.makeInvoice(args);
      return paymentRequest;
    } catch (e: any) {
      setError(e.message || "Failed to create invoice");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const convertSatsToFiat = async (sats: number): Promise<number> => {
    try {
      return (sats * BTC_PRICE_USD) / SATS_PER_BTC;
    } catch (e) {
      setError("Failed to convert sats to fiat");
      return 0;
    }
  };

  const convertFiatToSats = async (dollars: number): Promise<number> => {
    try {
      return Math.floor((dollars * SATS_PER_BTC) / BTC_PRICE_USD);
    } catch (e) {
      setError("Failed to convert fiat to sats");
      return 0;
    }
  };

  return {
    sendPayment,
    keysend,
    getInfo,
    makeInvoice,
    convertSatsToFiat,
    convertFiatToSats,
    loading,
    error,
  };
};
