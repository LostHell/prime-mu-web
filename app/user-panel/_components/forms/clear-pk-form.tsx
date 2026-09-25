"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { clearPkAction } from "@/lib/actions/clear-pk";
import { type Character } from "@/lib/types/character";
import { CharacterSection, CharacterValues } from "../character-info";
import { startTransition, useActionState } from "react";

interface ClearPkFormProps {
  character: Character;
}

export function ClearPkForm({ character }: ClearPkFormProps) {
  const [state, formAction, isPending] = useActionState(clearPkAction, {});

  const handleConfirm = () => {
    const formData = new FormData();
    formData.set("characterName", character.name);
    startTransition(() => {
      formAction(formData);
    });
  };

  const hasPk = character.pkCount > 0;

  return (
    <div className="flex flex-col gap-6">
      <CharacterSection title="Player Killer status">
        <CharacterValues
          items={[
            { label: "PK kills", value: character.pkCount },
            {
              label: "Service status",
              value: hasPk ? "Available to clear" : "Nothing to clear",
            },
          ]}
        />
      </CharacterSection>
      {state.message && (
        <Alert variant={state.success ? "success" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {!hasPk ? (
        <Alert>
          <AlertDescription>
            Your character has no PK kills. Nothing to clear.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            This will remove all Player Killer marks from your character,
            allowing you to enter towns and interact with NPCs freely.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isPending}
                className="w-full sm:w-auto sm:self-start"
              >
                Clear PK Status
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear PK Status?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset your PK count to zero on{" "}
                  <span className="text-foreground font-medium">
                    {character.name}
                  </span>{" "}
                  and remove the Player Killer mark. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleConfirm}
                >
                  Confirm Clear
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
