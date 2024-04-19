import abi from './abi/ERC20_abi.json'
import { type Address, type Chain } from 'viem'

export const ERC20 = {
    abi: abi,
    address: process.env.NEXT_PUBLIC_ADDR_TOKEN as Address,
}