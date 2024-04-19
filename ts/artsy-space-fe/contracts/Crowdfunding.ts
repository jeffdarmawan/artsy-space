import abi from './abi/Crowdfunding_abi.json'
import { type Address, type Chain } from 'viem'

export const CrowdfundingConf = {
    abi: abi,
    address: process.env.NEXT_PUBLIC_ADDR_CROWDFUND as Address,
}

export type CrowdfundListing = {
    tokenID: number,
    goal: number,
    deadline: number,
    raised: number,
    topDonor: Address,
}