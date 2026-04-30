"use client";

import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface UserPanelPageLayoutProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
}

export function UserPanelPageLayout({
  title,
  description,
  children,
  className,
  cardClassName,
}: UserPanelPageLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <Headline>
        <Text as="h1" variant="h4">
          {title}
        </Text>
        {description && <Text variant="small">{description}</Text>}
      </Headline>

      <div
        className={cn(
          "md:bg-card md:border md:border-border md:p-6 md:backdrop-blur-md",
          cardClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
