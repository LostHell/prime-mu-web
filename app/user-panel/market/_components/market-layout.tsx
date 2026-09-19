"use client";

import { UserPanelPageLayout } from "../../_components/user-panel-page-layout";

interface MarketLayoutProps {
  children: React.ReactNode;
}

export function MarketLayout({ children }: MarketLayoutProps) {
  return (
    <UserPanelPageLayout
      title="Market"
      description="Buy and sell warehouse items. Prices are paid from deposits."
    >
      {children}
    </UserPanelPageLayout>
  );
}
