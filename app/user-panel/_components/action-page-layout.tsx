"use client";

import EmptyState from "@/components/empty-state";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { type CharacterWithNextReset } from "@/lib/types/character";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";
import { useUserPanel } from "../_context/user-panel-context";
import { UserPanelPageLayout } from "./user-panel-page-layout";

const SERVICES = [
  { label: "Overview", href: "/user-panel" },
  { label: "Add stats", href: "/user-panel/add-stats" },
  { label: "Reset character", href: "/user-panel/reset" },
  { label: "Clear PK", href: "/user-panel/clear-pk" },
];

interface ActionPageLayoutProps {
  title: string;
  description?: string;
  children: (character: CharacterWithNextReset) => React.ReactNode;
}

export function ActionPageLayout({
  title,
  description,
  children,
}: ActionPageLayoutProps) {
  const { selectedCharacter } = useUserPanel();
  const pathname = usePathname();
  const router = useRouter();
  const currentService = SERVICES.find((service) => service.href === pathname);

  return (
    <UserPanelPageLayout
      title={title}
      description={description}
      cardClassName="md:p-5"
    >
      {selectedCharacter ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold break-all">
              {selectedCharacter.name}
            </p>
            <p className="text-foreground text-sm font-medium">
              {selectedCharacter.class}
            </p>
            <p className="text-muted-foreground text-sm">
              Level{" "}
              <span className="text-foreground font-semibold tabular-nums">
                {selectedCharacter.level}
              </span>
              <span className="ml-3">Resets</span>{" "}
              <span className="text-foreground font-semibold tabular-nums">
                {selectedCharacter.resets}
              </span>
            </p>
          </div>
          <Field className="sm:max-w-xs">
            <FieldLabel htmlFor="character-service">
              Character service
            </FieldLabel>
            <Select
              value={pathname}
              onValueChange={(href) => router.push(href)}
            >
              <SelectTrigger id="character-service" className="w-full">
                <SelectValue>{currentService?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {SERVICES.map(({ label, href }) => (
                    <SelectItem key={href} value={href}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Separator />
          <Fragment key={selectedCharacter.name}>
            {children(selectedCharacter)}
          </Fragment>
        </div>
      ) : (
        <EmptyState
          title="No characters yet"
          description="Create a character in-game to use character services."
        />
      )}
    </UserPanelPageLayout>
  );
}
