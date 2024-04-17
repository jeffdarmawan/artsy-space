"use client";

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
// ==

// config rainbowkit
const config = getDefaultConfig({
  appName: 'Artsy Space (App)',
  projectId: '', // WalletConnect projectId. see: https://www.rainbowkit.com/docs/installation#configure
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
  
});

import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { http, createConfig } from 'wagmi'
export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Create Wagmi' }),
    walletConnect({ projectId: '' || '' }),
  ],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
  },
})

import {useState} from 'react';

export const Web3Provider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider modalSize='compact'>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

