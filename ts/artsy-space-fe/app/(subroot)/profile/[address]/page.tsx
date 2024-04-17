// packages
import { ChevronDown } from "lucide-react";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import Text from "@/ui/text";
import Heading from "@/ui/head";
import { DropdownIcon } from "@/ui/assets/svg";

// ui
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

// lib
import { cn } from "@/lib/utils";
import CatalogToggle from "@/app/(subroot)/shop/catalogToggle";
import CatalogProduct from "@/app/(subroot)/shop/catalogProduct";

const categories = [
  {
    value: "all-headphones",
    text: "All Headphones",
  },
  {
    value: "tws",
    text: "TWS",
  },
  {
    value: "headset",
    text: "Headset",
  },
  {
    value: "gaming-headset",
    text: "Gaming Headset",
  },
  {
    value: "earbud",
    text: "Earbud",
  },
];

const prices = [
  {
    value: "all-price",
    text: "All Price",
  },
  {
    value: "0-100",
    text: "$0.00 - $100.00",
  },
  {
    value: "100-200",
    text: "$100.00 - $200.00",
  },
  {
    value: "200-300",
    text: "$200.00 - $300.00",
  },
  {
    value: "300-400",
    text: "$300.00 - $400.00",
  },
  {
    value: "400+",
    text: "$400.00 +",
  },
];

const sorts = [
  {
    value: "related-products",
    text: "Related Products",
  },
  {
    value: "price-low-to-high",
    text: "Price Low to High",
  },
  {
    value: "price-high-to-low",
    text: "Price High to Low",
  },
  {
    value: "newest-products",
    text: "Newest Products",
  },
  {
    value: "best-ratings",
    text: "Best Ratings",
  },
  {
    value: "largest-discount",
    text: "Largest Discount",
  },
  {
    value: "most-viewed",
    text: "Most Viewed",
  },
  {
    value: "best-sellers",
    text: "Best Sellers",
  },
  {
    value: "most-reviews",
    text: "Most Reviews",
  },
  {
    value: "available-stock",
    text: "Available Stock",
  },
];

export default function Page() {
  return (
    <SectionLayout>
      <div className="px-8">
        <div className="relative flex h-[300px] flex-col items-center justify-center gap-4 bg-[#F3F5F7] text-center">
          <div className="flex items-center gap-4">
            <Text
              size="sm"
              color="gray"
              weight={500}
              className="flex items-center gap-1"
            >
              Home{" "}
              <DropdownIcon stroke="#6C7275" className="h-3 w-3 -rotate-90" />
            </Text>
            <Text size="sm" weight={500}>
              Shop
            </Text>
          </div>
          <Heading as="h1" intent="shop-page">
            Your Collection
          </Heading>
          <Text className="lg:text-lg">
            Listen to the amazing music sound. Mari ngrungokne sworo.
          </Text>
        </div>

        <CatalogProduct />
      </div>
    </SectionLayout>
  );
}
