import React from "react";
import { useScrollPayment } from "../hooks/useScrollPayment";
import { Switch } from "@headlessui/react";

interface ScrollPaymentProps {
  recipientAddress: string;
  amountPerScroll?: number;
}

export const ScrollPayment: React.FC<ScrollPaymentProps> = ({
  recipientAddress,
  amountPerScroll = 1,
}) => {
  const { totalPaid, error, isEnabled, setIsEnabled } = useScrollPayment(
    recipientAddress,
    amountPerScroll
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Scroll Payments</h2>
        <Switch
          checked={isEnabled}
          onChange={setIsEnabled}
          className={`${
            isEnabled ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              isEnabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">
            Pay {amountPerScroll} sat{amountPerScroll > 1 ? "s" : ""} per scroll
          </p>
          <p className="text-sm text-gray-600">Total paid: {totalPaid} sats</p>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="text-sm text-gray-500">
          {isEnabled
            ? "Scroll payments are enabled. Scroll to send sats!"
            : "Toggle the switch to enable scroll payments"}
        </div>
      </div>
    </div>
  );
};
