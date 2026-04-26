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
import { cn } from "@/lib/utils";
import { ShieldCheck, Skull } from "lucide-react";
import { useActionState } from "react";

interface ClearPkFormProps {
  character: Character;
}

export function ClearPkForm({ character }: ClearPkFormProps) {
  const [state, formAction, isPending] = useActionState(clearPkAction, {});

  const handleConfirm = () => {
    const formData = new FormData();
    formData.set("characterName", character.name);
    formAction(formData);
  };

  const hasPk = character.pkCount > 0;

  return (
    <div className="space-y-6">
      <div className="py-4 text-center">
        <div
          className={cn(
            "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full",
            hasPk ? "bg-crimson/10" : "bg-online/10",
          )}
        >
          {hasPk ? (
            <Skull className="text-crimson size-8" />
          ) : (
            <ShieldCheck className="text-online size-8" />
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-muted-foreground text-sm">
            Current PK Count:
          </span>
          <span
            className={cn(
              "text-2xl font-bold tabular-nums",
              hasPk ? "text-crimson" : "text-online",
            )}
          >
            {character.pkCount}
          </span>
        </div>
      </div>

      {state.message && (
        <Alert variant={state.success ? "success" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {!hasPk ? (
        <div className="bg-online/5 border-online/20 rounded-lg border py-4 text-center">
          <ShieldCheck className="text-online mx-auto mb-2 size-5" />
          <p className="text-muted-foreground text-sm">
            Your character has no PK kills. Nothing to clear.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            This will remove all Player Killer marks from your character,
            allowing you to enter towns and interact with NPCs freely.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isPending}>Clear PK Status</Button>
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
