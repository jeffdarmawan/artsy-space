import type { Metadata } from "next";

import PageLayout from "@/layouts/pageLayout";

export const metadata: Metadata = {
  title: "Artsy Space",
  description: "Artsy Space",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("app/(root)/layout.tsx");
  return <PageLayout root={true}>{children}</PageLayout>;
}
