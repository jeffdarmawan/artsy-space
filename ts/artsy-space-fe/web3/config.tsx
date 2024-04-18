import { locall } from '@/web3/chains/locall';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { http, createConfig } from 'wagmi'

export const wagmiConfig = createConfig({
  chains: [locall],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Create Wagmi' }),
    walletConnect({ projectId: 'a7d7dba9009888d367605c21d90f9ce9' || '' }),
  ],
  ssr: true,
  transports: {
    [locall.id]: http(),
  },
})

// config rainbowkit
// const config = getDefaultConfig({
//   appName: 'Artsy Space (App)',
//   projectId: 'a7d7dba9009888d367605c21d90f9ce9', // WalletConnect projectId. see: https://www.rainbowkit.com/docs/installation#configure
//   chains: [locall],
//   ssr: true, // If your dApp uses server side rendering (SSR)
// });