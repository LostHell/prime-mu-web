"use client";

import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { LayoutCard } from "./layout-card";

interface UserPanelPageLayoutProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  cardClassName?: string;
}

export function UserPanelPageLayout({
  title,
  description,
  children,
  cardClassName,
}: UserPanelPageLayoutProps) {
  return (
    <>
      <Headline>
        <Text as="h1" variant="h4">
          {title}
        </Text>
        {description && <Text variant="small">{description}</Text>}
      </Headline>

      <LayoutCard className={cardClassName}>{children}</LayoutCard>
    </>
  );
}
