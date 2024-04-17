// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import Text from "@/ui/text";
import Heading from "@/ui/head";

// lib
import CatalogProduct from "@/app/(subroot)/shop/catalogProduct";
import MintNFTModal from "@/components/ui/mint-mft-modal";

// import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { useAccount } from 'wagmi'

export default function Page() {
  const address = useAccount();

  return (
    <SectionLayout>
      <div className="px-8">
        <div className="relative flex h-[300px] flex-col items-center justify-center gap-4 bg-[#F3F5F7] text-center">
          <Heading as="h1" intent="shop-page">
            Your Collection
          </Heading>
          {address && <MintNFTModal />}
        </div>

        <CatalogProduct />
      </div>
    </SectionLayout>
  );
}
