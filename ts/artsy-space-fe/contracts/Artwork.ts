import abi from './abi/Artwork_abi.json'
import { type Address, type Chain } from 'viem'

export const ArtworkConf = {
    abi: abi,
    address: process.env.NEXT_PUBLIC_ADDR_ARTWORK as Address,
}

export type Artwork = {
    id: number,
    title: string,
    description: string,
    image_url: string,
}