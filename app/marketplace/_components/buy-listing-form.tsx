"use client";

import { buyMarketplaceItemAction } from "@/actions";
import Feedback from "@/components/ui/feedback";
import { useActionState } from "react";

type BuyListingFormProps = {
  listingId: number;
  characters: string[];
};

const BuyListingForm = ({ listingId, characters }: BuyListingFormProps) => {
  const [state, formAction, isPending] = useActionState(buyMarketplaceItemAction, {});

  if (!characters.length) {
    return <p className="text-xs text-muted-foreground">No characters available to receive item.</p>;
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="listingId" value={String(listingId)} />

      <select name="buyerCharacter" className="input-gold text-xs h-9" defaultValue={characters[0]}>
        {characters.map((character) => (
          <option key={character} value={character}>
            {character}
          </option>
        ))}
      </select>

      <button type="submit" disabled={isPending} className="btn-gold w-full text-xs h-9">
        {isPending ? "Buying..." : "Buy Now"}
      </button>

      {state.message ? <Feedback type={state.success ? "success" : "error"} message={state.message} /> : null}
    </form>
  );
};

export default BuyListingForm;
