import abi from './abi/Crowdfunding_abi.json'
import { type Address, type Chain } from 'viem'

export const Crowdfunding = {
    abi: abi,
    address: '0x814000936bB7251d07fE7E72453749CE38867cf3' as Address,
}

export type CrowdfundListing = {
    tokenID: number,
    goal: number,
    deadline: number,
    raised: number,
    topDonor: Address,
}