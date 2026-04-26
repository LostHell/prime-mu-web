"use client";

import { Card, CardContent } from "@/components/ui/card";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";

interface MarketLayoutProps {
  children: React.ReactNode;
}

export function MarketLayout({ children }: MarketLayoutProps) {
  return (
    <>
      <Headline>
        <Text as="h1" variant="h4">
          Market
        </Text>
        <Text variant="small">Buy and sell items with other players</Text>
      </Headline>
      <Card>
        <CardContent>{children}</CardContent>
      </Card>
    </>
  );
}
