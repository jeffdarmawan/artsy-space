'use client';
// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import Text from "@/ui/text";
import Heading from "@/ui/head";

// lib
import CatalogProduct from "@/app/(subroot)/shop/catalogProduct";

// import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { useAccount, useWriteContract, useChains } from 'wagmi'
import { Button } from '@mui/material'

import abi from '@/contracts/abi/MyToken_abi.json' 
import NFTMintModal from "@/components/ui/nft-mint-modal";
import NFTSellModal from "@/components/ui/nft-sell-modal";
import NFTCrowdfundModal from "@/components/ui/nft-crowdfund-modal";
import { Address } from "viem";
import CatalogCrowdfund from "./catalogCrowdfund";

export default function Page() {
  const account = useAccount();

  return (
    <SectionLayout>
      <div className="px-8">
        <div className="relative flex h-[300px] flex-col items-center justify-center gap-4 bg-[#F3F5F7] text-center">
          <Heading as="h1" intent="shop-page">
            Marketplace
          </Heading>
          {/* <p>Your address: {account.address}</p> */}
          {/* <p>account content: </p> */}
          {/* <pre>
            {JSON.stringify(account, null, 2)}
          </pre> */}
          
        </div>

        <CatalogCrowdfund/>
      </div>
    </SectionLayout>
  );
}
