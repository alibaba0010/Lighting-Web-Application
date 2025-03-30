import { useEffect, useRef, useState } from "react";
import { useWebLNPayments } from "./useWebLNPayments";

export const useScrollPayment = (
  recipientAddress: string,
  amountPerScroll: number = 1
) => {
  const [totalPaid, setTotalPaid] = useState(0);
  const lastScrollTime = useRef(Date.now());
  const { keysend, error } = useWebLNPayments();
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const handleScroll = async () => {
      if (!isEnabled) return;

      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime.current;

      // Prevent multiple payments within 2 seconds
      if (timeSinceLastScroll < 2000) return;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(async () => {
        try {
          await keysend(recipientAddress, amountPerScroll);
          setTotalPaid((prev) => prev + amountPerScroll);
          lastScrollTime.current = now;
        } catch (e) {
          console.error("Failed to send scroll payment:", e);
        }
      }, 500); // Debounce scroll events
    };

    if (isEnabled) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [isEnabled, recipientAddress, amountPerScroll, keysend]);

  return {
    totalPaid,
    error,
    isEnabled,
    setIsEnabled,
  };
};
