"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useWebLNPayments } from "../hooks/useWebLNPayments";
import type { GetInfoResponse } from "webln";
import { useWebLN } from "../contexts/WebLNContext";
import { BoltIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export const WalletInfo: React.FC = () => {
  const { getInfo, loading, error } = useWebLNPayments();
  const [walletInfo, setWalletInfo] = useState<GetInfoResponse | null>(null);
  const { isEnabled, connecting } = useWebLN();

  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (isEnabled) {
        const info = await getInfo();
        if (info) {
          setWalletInfo(info);
        }
      }
    };

    fetchWalletInfo();
  }, [isEnabled]);

  if (connecting) {
    return (
      <div className="p-6 bg-card rounded-lg shadow-md border border-gray-200 dark:border-gray-800 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2 items-center">
          <BoltIcon className="h-5 w-5 text-primary" />
          <span>Connecting to wallet...</span>
        </div>
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <div className="p-6 bg-card rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 text-amber-500 mb-2">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <h2 className="text-xl font-bold">Wallet Not Connected</h2>
        </div>
        <p className="text-muted-foreground">
          Please connect your Lightning wallet to view your wallet information.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-card rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
        <div className="animate-pulse flex space-x-2 items-center">
          <BoltIcon className="h-5 w-5 text-primary" />
          <span>Loading wallet info...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-card rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 text-destructive mb-2">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <h2 className="text-xl font-bold">Error</h2>
        </div>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!walletInfo) {
    return (
      <div className="p-6 bg-card rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 text-amber-500 mb-2">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <h2 className="text-xl font-bold">No Wallet Information</h2>
        </div>
        <p className="text-muted-foreground">
          No wallet information is available. Your wallet may not support the
          getInfo method.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <BoltIcon className="h-5 w-5 mr-2" />
        Wallet Information
      </h2>
      <div className="space-y-4">
        {walletInfo.node && (
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">Node Alias:</span>{" "}
              <span className="font-mono text-primary">
                {walletInfo.node.alias || "Unknown"}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium">Node Pubkey:</span>
              <div className="font-mono text-xs mt-1 p-2 bg-background rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                {walletInfo.node.pubkey}
              </div>
            </div>
          </div>
        )}
        {!walletInfo.node && (
          <div className="text-amber-500">
            Limited wallet information available
          </div>
        )}
      </div>
    </div>
  );
};
