import React, { useEffect, useState } from "react";
import { useWebLNPayments } from "../hooks/useWebLNPayments";
import { GetInfoResponse } from "webln";

export const WalletInfo: React.FC = () => {
  const { getInfo, loading, error } = useWebLNPayments();
  const [walletInfo, setWalletInfo] = useState<GetInfoResponse | null>(null);

  useEffect(() => {
    const fetchWalletInfo = async () => {
      const info = await getInfo();
      if (info) {
        setWalletInfo(info);
      }
    };

    fetchWalletInfo();
  }, [getInfo]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">Loading wallet info...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
    );
  }

  if (!walletInfo) {
    return (
      <div className="p-4 bg-yellow-100 rounded-lg">
        No wallet information available
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Wallet Information</h2>
      <div className="space-y-2">
        {walletInfo.node && (
          <div>
            <span className="font-semibold">Node Alias:</span>{" "}
            {walletInfo.node.alias}
          </div>
        )}
        {walletInfo.node && (
          <div>
            <span className="font-semibold">Node Pubkey:</span>
            <div className="text-sm break-all">{walletInfo.node.pubkey}</div>
          </div>
        )}
      </div>
    </div>
  );
};
