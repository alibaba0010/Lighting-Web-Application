"use client";

import type React from "react";
import { useScrollPayment } from "../hooks/useScrollPayment";
import { Switch } from "@headlessui/react";
import { BoltIcon } from "@heroicons/react/24/outline";

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
    <div className="p-6 bg-card-background text-card-foreground rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <BoltIcon className="h-6 w-6 text-primary mr-2" />
          Scroll Payments
        </h2>
        <Switch
          checked={isEnabled}
          onChange={setIsEnabled}
          className={`${
            isEnabled ? "bg-primary" : "bg-secondary"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
        >
          <span
            className={`${
              isEnabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-background transition-transform`}
          />
        </Switch>
      </div>

      <div className="space-y-4">
        <div className="bg-background/50 p-3 rounded-md">
          <p className="text-sm text-foreground/80">
            Pay {amountPerScroll} sat{amountPerScroll > 1 ? "s" : ""} per scroll
          </p>
          <p className="text-sm font-medium mt-1">
            Total paid:{" "}
            <span className="text-primary font-mono">{totalPaid} sats</span>
          </p>
        </div>

        {error && <div className="text-destructive text-sm">{error}</div>}

        <div className="text-sm text-muted-foreground">
          {isEnabled
            ? "Scroll payments are enabled. Scroll to send sats!"
            : "Toggle the switch to enable scroll payments"}
        </div>
      </div>
    </div>
  );
};
