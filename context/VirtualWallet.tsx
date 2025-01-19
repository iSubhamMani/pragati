/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useState } from "react";

interface VirtualWalletContextType {
  balance: number;
  setBalance: (updater: number | ((prevBalance: number) => number)) => void;
}

export const VirtualWalletContext = createContext<VirtualWalletContextType>({
  balance: 0,
  setBalance: () => {},
});

import { ReactNode } from "react";

export const VirtualWalletContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [balance, setBalance] = useState(0);

  return (
    <VirtualWalletContext.Provider
      value={{
        balance,
        setBalance,
      }}
    >
      {children}
    </VirtualWalletContext.Provider>
  );
};
