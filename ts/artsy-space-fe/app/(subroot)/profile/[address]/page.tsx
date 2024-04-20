'use client';
// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import Text from "@/ui/text";
import Heading from "@/ui/head";

// lib
import CatalogProduct from "@/app/(subroot)/profile/catalogProduct";
import NFTMintModal from "@/components/ui/nft-mint-modal";

import { useAccount, useWriteContract, useChains } from 'wagmi'

import { Address } from "viem";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Page({
  params,
}: {
  params: { address: string };
}) {
  const account = useAccount();

  if (account.address == params.address) {
    console.log("inside if cond");
    redirect("/profile");
  }

  return (
    <SectionLayout>
      <div className="px-8">
        <div className="relative flex h-[300px] flex-col items-center justify-center gap-4 bg-[#F3F5F7] text-center">
          <Heading as="h1" intent="shop-page">
            Not Your Collection
          </Heading>
          <p>Viewing {params.address}'s</p>
        </div>

        <CatalogProduct address={params.address as Address} />
      </div>
    </SectionLayout>
  );
}
