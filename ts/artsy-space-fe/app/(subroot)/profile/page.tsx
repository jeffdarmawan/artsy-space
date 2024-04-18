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

export default function Page() {
  const account = useAccount();
  const chains = useChains();

  const { data: hash, writeContract } = useWriteContract() 

  // this transfers MyToken we did in the gmeet
  const handleTransfer = () => {
    console.log("transferring");
    writeContract({ 
      address: '0x18Bd9dC4F31f2Fbd7Fa2C7524a076DB877c5C239', 
      abi: abi, 
      functionName: 'transfer', 
      args: ['0x475b87f5C780E7F425B64fd041b4de3ca328658f', 2000], 
    }) 
  };

  return (
    <SectionLayout>
      <div className="px-8">
        <div className="relative flex h-[300px] flex-col items-center justify-center gap-4 bg-[#F3F5F7] text-center">
          <Heading as="h1" intent="shop-page">
            Your Collection
          </Heading>
          <p>Your address: {account.address}</p>
          {/* <p>account content: </p> */}
          {/* <pre>
            {JSON.stringify(account, null, 2)}
          </pre> */}
          {account.address && <NFTMintModal />}
          {account.address && <NFTSellModal />}
          {account.address && <NFTCrowdfundModal/>}
        </div>

        <Button onClick={handleTransfer}>Transfer</Button>

        <CatalogProduct address={undefined} />
      </div>
    </SectionLayout>
  );
}
