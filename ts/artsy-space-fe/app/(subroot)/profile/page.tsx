'use client';
// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import Text from "@/ui/text";
import Heading from "@/ui/head";

// lib
import CatalogProduct from "@/app/(subroot)/shop/catalogProduct";
import MintNFTModal from "@/components/ui/mint-mft-modal";

// import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { useAccount, useWriteContract, useChains } from 'wagmi'
import { Button } from '@mui/material'

import abi from '@/abi/MyToken_abi.json' 

export default function Page() {
  const account = useAccount();
  const chains = useChains();

  const { data: hash, writeContract } = useWriteContract() 
  console.log(chains)
  console.log(account)
  console.log(account.address)
  console.log(account.addresses)
  console.log(account.chain)
  console.log(account.chainId)
  console.log(account.connector)
  console.log(account.isConnected)
  console.log(account.isConnecting)
  console.log(account.isDisconnected)
  console.log(account.isReconnecting)
  console.log(account.status)


  const handleTransfer = () => {
    console.log("transferring");
    // setFile(acceptedFiles[0]);
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
          <p>account content: </p>
          {/* <pre>
            {JSON.stringify(account, null, 2)}
          </pre> */}
          {/* account.address: {account.address}
          account.addresses: {account.addresses}
          account.chain.name: {account.chain?.name}
          account.chain: {account.chain?.name}
          account.chainId: {account.chainId}
          account.connector: {account.connector}
          account.isConnected: {account.isConnected}
          account.isConnecting: {account.isConnecting}
          account.isDisconnected: {account.isDisconnected}
          account.isReconnecting: {account.isReconnecting}
          account.status: {account.status} */}
          {account.address && <MintNFTModal />}
        </div>

        <Button onClick={handleTransfer}>Transfer</Button>

        <CatalogProduct />
      </div>
    </SectionLayout>
  );
}
