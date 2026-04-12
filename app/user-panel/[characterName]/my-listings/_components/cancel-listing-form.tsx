"use client";

import { cancelMarketplaceListingAction } from "@/actions";
import Feedback from "@/components/ui/feedback";
import { useActionState } from "react";

type CancelListingFormProps = {
  listingId: number;
  characterName: string;
};

const CancelListingForm = ({ listingId, characterName }: CancelListingFormProps) => {
  const [state, formAction, isPending] = useActionState(cancelMarketplaceListingAction, {});

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="listingId" value={String(listingId)} />
      <input type="hidden" name="characterName" value={characterName} />

      <button type="submit" disabled={isPending} className="btn-outline w-full text-xs h-9">
        {isPending ? "Cancelling..." : "Cancel Listing"}
      </button>

      {state.message ? <Feedback type={state.success ? "success" : "error"} message={state.message} /> : null}
    </form>
  );
};

export default CancelListingForm;
