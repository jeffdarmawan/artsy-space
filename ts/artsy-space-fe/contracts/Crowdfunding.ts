import abi from './abi/Crowdfunding_abi.json'
import { type Address, type Chain } from 'viem'

export const Crowdfunding = {
    abi: abi,
    address: '0x50F12EBCf241D560C3d5CFE03d40886Ef90E16A9' as Address,
}

export type CrowdfundListing = {
    tokenID: number,
    goal: number,
    deadline: number,
    raised: number,
    topDonor: Address,
}