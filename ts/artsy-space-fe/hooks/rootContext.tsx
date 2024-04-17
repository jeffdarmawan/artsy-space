"use client";

import { createContext, useContext } from "react";
import { Web3Provider } from "@/hooks/web3Context";

const RootContext = createContext<boolean>(false);

export const RootContextProvider = ({
  root,
  children,
}: {
  root: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Web3Provider>
      <RootContext.Provider value={root}>{children}</RootContext.Provider>
    </Web3Provider>
  );
};

export const useRootContext = () => {
  return useContext(RootContext);
};
