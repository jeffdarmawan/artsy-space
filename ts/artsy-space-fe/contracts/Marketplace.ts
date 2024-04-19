import abi from './abi/Marketplace_abi.json'
import { type Address, type Chain } from 'viem'

export const MarketplaceConf = {
    abi: abi,
    address: process.env.NEXT_PUBLIC_ADDR_MARKETPLACE as Address,
}