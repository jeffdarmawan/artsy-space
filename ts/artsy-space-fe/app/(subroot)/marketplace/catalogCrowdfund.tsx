'use client';

// ui
import * as ProductCard from "@/ui/card/productCard";

// stores
import { useProductDetail } from "@/stores/zustand";

// lib
import { cn } from "@/lib/utils";

// wagmi
import { useAccount, useWriteContract } from 'wagmi'
import { readContract } from "@wagmi/core";
import { type Address, type Chain } from 'viem'

// abi
import { Artwork, ArtworkConf } from '@/contracts/Artwork'
import { useEffect, useState } from 'react';
import { wagmiConfig } from "@/web3/config";
import NFTSellModal from "@/components/ui/nft-sell-modal";
import NFTCrowdfundModal from "@/components/ui/nft-crowdfund-modal";
import { CrowdfundingConf } from "@/contracts/Crowdfunding";
import { MarketplaceConf } from "@/contracts/Marketplace";

const CatalogCrowdfund = () => {

  const account = useAccount();
  const [isOwner, setIsOwner] = useState<boolean>();

  const [artworks, setArtworks] = useState<Array<Artwork>>([]);

  async function startFetching() {
    // get Artworks by owner

    // console.log("address: ", address)
    // console.log("account.address: ", account.address)
    // if (!address) return;
    const tokenIds = await readContract(wagmiConfig, { 
          abi: MarketplaceConf.abi, 
          address: MarketplaceConf.address, 
          functionName: 'getAllListedTokens', 
          args: [  ], 
      }) as Array<number>;

    console.log('tokenIds: ', tokenIds);

    const tokenMetadataList = await Promise.all(tokenIds.map(async (tokenId): Promise<Artwork> => {
      // get tokenURI from smart contract
      const tokenURI = await readContract(wagmiConfig, { 
        abi: ArtworkConf.abi, 
        address: ArtworkConf.address, 
        functionName: 'tokenURI', 
        args: [ Number(tokenId) ], 
      });

      console.log('tokenURI: ', tokenURI);
      
      // fetch metadata from tokenURI output (S3)
      const res = await fetch(tokenURI as string);
      var metadataRes = await res.json();
      metadataRes.id = tokenId;
      console.log("metadataRes: ", metadataRes);

      return metadataRes as Artwork;
      }));

    setArtworks(tokenMetadataList);
  }

  useEffect(() => {

    console.log('Effect is running');
    
    startFetching();
    // setIsOwner(account.address === address);

    return () => {
      console.log('Effect cleanup');
    };
  }, [])

  const showDetail = useProductDetail((state) => state.showDetail);
  return (
    <div className="space-y-8 py-20 pt-8 lg:space-y-20">
      <div
        className={cn(
          "grid gap-x-2 gap-y-4 lg:gap-x-4 lg:gap-y-8",
          showDetail
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        )}
      >
        {artworks.map((artwork) => (
          <ProductCard.Root
            key={artwork.title}
            data={artwork}
            className={
              showDetail ? "sm:grid-cols-2 sm:place-items-center" : undefined
            }
          >
            {/* product card thumbnail */}
            <a href={"/artwork/"+artwork.id}>
            <ProductCard.Thumbnail>
              {/* badge */}
              <ProductCard.ThumbnailBadge>
                <div className="space-y-1.5">
                  {/* <ProductCard.Badge>new</ProductCard.Badge>
                  <ProductCard.Badge intent="discount">
                    50% off
                  </ProductCard.Badge> */}
                </div>

                {/* {!showDetail && <ProductCard.WishlistButton />} */}
              </ProductCard.ThumbnailBadge>

              {/* image */}
              <ProductCard.Image />
            </ProductCard.Thumbnail>
            </a>

            {/* product card content */}
            <a href={"/artwork/"+artwork.id}>
            <ProductCard.Content className="md:p-6">

                <div className="space-y-4 pt-1 lg:space-y-6">
                  <ProductCard.Title className="line-clamp-3" />
                  <ProductCard.Description className="line-clamp-3 md:text-sm" />
                  <div className="flex flex-col gap-2">
                  </div>
                </div>
              
            </ProductCard.Content>
            </a>
          </ProductCard.Root>
        ))}
      </div>

      {/* <div className="flex justify-center">
        <button className="rounded-full border border-[#141718] px-10 py-1.5 font-inter text-base font-medium text-[#141718]">
          Show more
        </button>
      </div> */}
    </div>
  );
};

export default CatalogCrowdfund;
