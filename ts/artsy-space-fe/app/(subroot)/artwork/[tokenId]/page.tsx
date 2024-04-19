'use client';
// package
import { notFound } from "next/navigation";
import { MinusIcon, PlusIcon } from "lucide-react";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// lib
import { formatCurrency } from "@/lib/utils";

// ui
import { StarIcon, WishlistIcon } from "@/ui/assets/svg";
import Button from "@/ui/button";
import ProductSlider from "@/ui/slider/productSlider";
import ProductTab from "@/app/(subroot)/products/productTab";
import ProductVariant from "@/app/(subroot)/products/productVariant";
import ProductRecommendation from "@/app/(subroot)/products/productRecommendation";

// NFT
import { BaseError, useReadContract, useWriteContract } from 'wagmi'
import { readContract, waitForTransactionReceipt, writeContract} from '@wagmi/core'
import { ArtworkConf } from '@/contracts/Artwork'
import { useState, useEffect } from 'react';
import { wagmiConfig } from "@/web3/config";
import { MarketplaceConf } from "@/contracts/Marketplace";
import { CrowdfundingConf, CrowdfundListing } from "@/contracts/Crowdfunding";
import { on } from "events";
import { Address, Hash } from "viem";
import { Input } from "@mui/material";
import { ERC20 } from "@/contracts/ERC20";

export default function Page({
    params,
}: {
    params: { tokenId: string };
}) {
    // token metadata as state
    const [metadata, setMetadata] = useState< { title: string; description: string; image_url: string } >();
    const [isOnSale, setIsOnSale] = useState<boolean>(false);
    const [price, setPrice] = useState<number>();

    // crowdfund state
    const [crowdfund, setCrowdfund] = useState< CrowdfundListing >();
    const [isCrowdfund, setIsCrowdfund] = useState<boolean>();
    const [crowdfundAmount, setCrowdfundAmount] = useState<number>();

    const [isPending, setIsPending] = useState<boolean>(false);

    async function startFetching() {
      // get tokenURI from smart contract
      const tokenURI = await readContract(wagmiConfig, { 
            abi: ArtworkConf.abi, 
            address: ArtworkConf.address, 
            functionName: 'tokenURI', 
            args: [ Number(params.tokenId) ], 
        });

      console.log('tokenURI: ', tokenURI);
      
      // fetch metadata from tokenURI output (S3)
      const res = await fetch(tokenURI as string);
      const metadataRes = await res.json();
      console.log("metadataRes: ", metadataRes);

      // set metadata state
      setMetadata(metadataRes);

      // check if onSale
      const priceResult = await readContract(wagmiConfig, { 
        abi: MarketplaceConf.abi, 
        address: MarketplaceConf.address, 
        functionName: 'getPrice', 
        args: [ Number(params.tokenId) ], 
      }) as number;
      console.log('priceResult: ', priceResult);

      setIsOnSale(priceResult > 0);
      setPrice(Number(priceResult));

      // check if onCrowdfund
      const crowdfundListingResult = await readContract(wagmiConfig, {
        abi: CrowdfundingConf.abi,
        address: CrowdfundingConf.address,
        functionName: 'getListing',
        args: [Number(params.tokenId)],
      }) as Array<string>;

      const crowdfundListing: CrowdfundListing = {
        tokenID: Number(params.tokenId),
        goal: Number(crowdfundListingResult[0]),
        deadline: Number(crowdfundListingResult[1]),
        raised: Number(crowdfundListingResult[2]),
        topDonor: crowdfundListingResult[3] as Address,
      };

      setCrowdfund(crowdfundListing);
      setIsCrowdfund(crowdfundListing.goal > 0);
    }

    // get token metadata
    useEffect(() => {

      console.log('Effect is running');
      
      startFetching();

      return () => {
        console.log('Effect cleanup');
      };
    }, [params.tokenId])

  // @Keran: here
  const handleDonate = async () => {
    setIsPending(true);
    console.log(Number(params.tokenId), crowdfundAmount)
    const approveHash = await writeContract(wagmiConfig, {
      address: ERC20.address,
      abi: ERC20.abi,
      functionName: 'approve',
      args: [CrowdfundingConf.address, crowdfundAmount],
    })

    console.log("approveHash: ", approveHash)

    const approveReceipt = await waitForTransactionReceipt(wagmiConfig, { hash: approveHash as Hash })
    
    console.log("approveReceipt: ", approveReceipt)

    const contributeHash = await writeContract(wagmiConfig, {
      address: CrowdfundingConf.address,
      abi: CrowdfundingConf.abi,
      functionName: 'contribute',
      args: [Number(params.tokenId), crowdfundAmount],
    })

    const crowdfundReceipt = await waitForTransactionReceipt(wagmiConfig, { hash: contributeHash as Hash })

    console.log("crowdfundReceipt: ", crowdfundReceipt);

    setIsPending(false);

    startFetching();
  }

  const handleBuy = async () => {
    setIsPending(true);

    const approveHash_buy = await writeContract(wagmiConfig, {
      address: ERC20.address,
      abi: ERC20.abi,
      functionName: 'approve',
      args: [MarketplaceConf.address, price], // TODO: change this 
    })

    console.log("approveHash: ", approveHash_buy)

    const approveReceipt = await waitForTransactionReceipt(wagmiConfig, { hash: approveHash_buy as Hash })
    
    console.log("approveReceipt: ", approveReceipt)

    console.log(params.tokenId)
    const buyHash = await writeContract(wagmiConfig, {
      address: MarketplaceConf.address,
      abi: MarketplaceConf.abi,
      functionName: 'buy',
      args: [Number(params.tokenId)],
    })

    console.log("buyHash: ", buyHash)

    setIsPending(false);
    startFetching();
  }

  return (
    <SectionLayout>
      <div className="mx-auto space-y-6 p-8 lg:space-y-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(min-content,_400px)_1fr_280px]">
          <div className="relative h-full w-full">
            <ProductSlider images={[metadata?.image_url ?? ""]} />
          </div>
          
          <div className="mx-auto max-w-[420px] md:max-w-[520px] lg:max-w-none">
            <div className="space-y-4 border-b border-[#E8ECEF] pb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  
                </div>

                <span className="font-inter text-xs font-normal text-[#141718]">
                  {/* 11 Reviews */}
                </span>
              </div>

              <h1 className="font-poppins text-[40px] font-medium text-[#141718]">
                {metadata?.title ?? ""}
              </h1>

              <p className="font-inter text-base font-normal text-[#6C7275]">
                {metadata?.description ?? ""}
              </p>

              <p className="font-poppins text-[28px] font-medium text-[#141718]">
                <span className="align-middle">
                  {/* {formatCurrency(data.price)} */}
                </span>
                <span className="ml-3 align-middle text-xl text-[#6C7275] line-through decoration-2">
                  {/* $400.00 */}
                </span>
              </p>
            </div>

            {/* <div className="space-y-3 border-b border-[#E8ECEF] py-6">
              <p className="font-inter text-base font-normal text-[#343839]">
                Offer expires in:
              </p>

              <div className="flex gap-4">
                <div className="w-fit">
                  <div className="flex h-[60px] w-[60px] items-center justify-center bg-[#F3F5F7] font-poppins text-[34px] font-medium text-[#141718]">
                    02
                  </div>
                  <p className="text-center font-inter text-xs font-normal text-[#6C7275]">
                    Days
                  </p>
                </div>
                <div className="w-fit">
                  <div className="flex h-[60px] w-[60px] items-center justify-center bg-[#F3F5F7] font-poppins text-[34px] font-medium text-[#141718]">
                    12
                  </div>
                  <p className="text-center font-inter text-xs font-normal text-[#6C7275]">
                    Hours
                  </p>
                </div>
                <div className="w-fit">
                  <div className="flex h-[60px] w-[60px] items-center justify-center bg-[#F3F5F7] font-poppins text-[34px] font-medium text-[#141718]">
                    45
                  </div>
                  <p className="text-center font-inter text-xs font-normal text-[#6C7275]">
                    Minutes
                  </p>
                </div>
                <div className="w-fit">
                  <div className="flex h-[60px] w-[60px] items-center justify-center bg-[#F3F5F7] font-poppins text-[34px] font-medium text-[#141718]">
                    05
                  </div>
                  <p className="text-center font-inter text-xs font-normal text-[#6C7275]">
                    Seconds
                  </p>
                </div>
              </div>
            </div> */}

            {/* <div className="space-y-6 py-6">
              <div className="space-y-2">
                <p className="font-inter text-base font-semibold text-[#6C7275]">
                  Measurements
                </p>
                <p className="font-inter text-xl font-normal text-[#141718]">
                  17 1/2x20 5/8
                </p>
              </div>

              <ProductVariant variants={data.variants} />
            </div> */}

            <div className="space-y-4 border-b border-[#E8ECEF] py-6 lg:hidden">
              <div className="flex h-10 gap-2 lg:h-[52px]">
                <div className="flex h-full w-1/2 items-center justify-between rounded bg-[#F5F5F5] px-2 md:w-3/5 lg:px-4">
                  <MinusIcon
                    stroke="#141718"
                    className="h-4 w-4 lg:h-5 lg:w-6"
                  />
                  <span className="font-inter text-sm font-semibold text-[#141718] lg:text-base">
                    1
                  </span>
                  <PlusIcon
                    stroke="#141718"
                    className="h-4 w-4 lg:h-5 lg:w-6"
                  />
                </div>

                <Button
                  variant="ghost"
                  width="full"
                  className="flex h-full items-center justify-center gap-2 rounded border border-[#141718]"
                >
                  <WishlistIcon
                    stroke="#141718"
                    className="h-4 w-4 lg:h-6 lg:w-6"
                  />
                  <span className="font-inter text-sm font-medium text-[#141718] lg:text-base">
                    Wishlist
                  </span>
                </Button>
              </div>

              <Button
                width="full"
                fontSize="sm"
                className="h-10 rounded lg:h-[52px] lg:text-base"
              >
                Add to Cart
              </Button>
            </div>

            {/* <div className="space-y-2 pt-6">
              <div className="grid grid-cols-[100px_1fr] font-inter text-xs lg:grid-cols-[140px_1fr] lg:text-sm">
                <span className="text-[#6C7275]">SKU</span>
                <span className="text-[#141718]">1117</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] font-inter text-xs lg:grid-cols-[140px_1fr] lg:text-sm">
                <span className="text-[#6C7275]">CATEGORY</span>
                <span className="text-[#141718]">
                  {data.categories.map((category) => (
                    <span
                      key={category}
                      className="after:ml-0.5 after:mr-1 after:content-[','] last:after:mx-0 last:after:content-['']"
                    >
                      {category}
                    </span>
                  ))}
                </span>
              </div>
            </div> */}
          </div>

          {/* ON SALE PURCHASE AREA */}
          {isOnSale &&
          <div className="hidden h-fit flex-col gap-8 rounded border border-[#E8ECEF] p-4 lg:flex">
            <div className="space-y-2">
              <p className="font-poppins font-semibold text-[#141718]">
                Artwork is on sale!
              </p>
              <div className="flex items-end justify-between">
                <p className="font-inter text-sm text-[#6C7275]">Price</p>
                <div className="space-y-1 text-right">
                  <p className="font-poppins text-xl font-semibold text-[#141718]">
                    WFH {price ?? 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {/* <Input type="number" placeholder="Enter amount" fullWidth={true} onChange={(e) => setCrowdfundAmount(Number(e.target.value))} /> */}
              <div className="h-2"></div>{/* add whitespace */}
              <Button width="full" fontSize="sm" className="h-10 rounded" onClick={handleBuy} disabled={isPending}>
                {isPending ? 'Sending...' : 'Buy'}
              </Button>
              {/* {error && ( 
                <div>Error: {(error as BaseError).shortMessage || error.message}</div> 
              )}  */}
            </div>
          </div>
          }
          
          {/* ON SALE PURCHASE AREA */}
          {isCrowdfund &&
          <div className="hidden h-fit flex-col gap-8 rounded border border-[#E8ECEF] p-4 lg:flex">
            <div className="space-y-2">
              <p className="font-poppins font-semibold text-[#141718]">
                Artwork is crowdfunding!
              </p>
              <div className="flex items-end justify-between">
                <p className="font-inter text-sm text-[#6C7275]">Goal</p>
                <div className="space-y-1 text-right">
                  <p className="font-poppins text-xl font-semibold text-[#141718]">
                    WFH {crowdfund?.goal ?? 0}
                  </p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="font-inter text-sm text-[#6C7275]">Raised</p>
                <div className="space-y-1 text-right">
                  <p className="font-poppins text-xl font-semibold text-[#141718]">
                    WFH {crowdfund?.raised ?? 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Input type="number" placeholder="Enter amount" fullWidth={true} onChange={(e) => setCrowdfundAmount(Number(e.target.value))} />
              <div className="h-2"></div>{/* add whitespace */}
              <Button width="full" fontSize="sm" className="h-10 rounded" onClick={handleDonate} disabled={isPending}>
                {isPending ? 'Sending...' : 'Donate'}
              </Button>
              {/* {error && ( 
                <div>Error: {(error as BaseError).shortMessage || error.message}</div> 
              )}  */}
            </div>
          </div>
          }
        </div>
      
        {/* <ProductTab tabs={data.tabs} /> */}
        {/* <ProductRecommendation /> */}
      </div>
    </SectionLayout>
  );
}
