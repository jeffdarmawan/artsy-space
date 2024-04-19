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

const CatalogProduct = ({ 
  address,
}: { address: Address }) => {

  const account = useAccount();
  const [isOwner, setIsOwner] = useState<boolean>();

  const [artworks, setArtworks] = useState<Array<Artwork>>([]);

  async function startFetching(address: Address) {
    // get Artworks by owner

    console.log("address: ", address)
    console.log("account.address: ", account.address)
    if (!address) return;
    const tokenIds = await readContract(wagmiConfig, { 
          abi: ArtworkConf.abi, 
          address: ArtworkConf.address, 
          functionName: 'getArtworkByOwner', 
          args: [ address ], 
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
    
    startFetching(address);

    console.log("account.address: ", account.address)
    console.log("param address: ", address)

    console.log("isowner1: ", account.address === address);
    console.log("isowner2: ", account.address == address);
    setIsOwner(account.address === address);

    return () => {
      console.log('Effect cleanup');
    };
  }, [address])

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
            {/* TODO: change url to Artwork page */}
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
              {/* <ProductCard.Ratings />
              <div className="flex items-center justify-between gap-1">
                <ProductCard.Name />
                <button
                  className={`flex items-center justify-center p-1.5 md:hidden ${
                    !showDetail && "hidden"
                  }`}
                >
                  <WishlistIcon className="h-7 w-7" />
                </button>
              </div>
              <ProductCard.Price /> */}

                <div className="space-y-4 pt-1 lg:space-y-6">
                  <ProductCard.Title className="line-clamp-3" />
                  <ProductCard.Description className="line-clamp-3 md:text-sm" />
                  
                  <div className="flex flex-col gap-2">
                    {/* <ProductCard.Button
                      variant="ghost"
                      width="full"
                      fontSize="sm"
                      className="flex items-center justify-center gap-1 lg:text-base"
                    >
                      <WishlistIcon fill="#141718" className="h-5 w-5" />
                      Wishlist
                    </ProductCard.Button> */}
                  </div>
                </div>
              
            </ProductCard.Content>
            </a>
            { isOwner && 
                    <>
                      <NFTSellModal {... artwork} />
                      <NFTCrowdfundModal {... artwork} />
                    </>}
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

export default CatalogProduct;
