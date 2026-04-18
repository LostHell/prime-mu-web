"use client";

import { listMarketplaceItemAction } from "@/actions";
import Feedback from "@/components/ui/feedback";
import { DecodedItem } from "@/types/item";
import { useActionState, useEffect } from "react";

type ListItemFormProps = {
  characterName: string;
  item: DecodedItem & { name: string };
  onClose?: () => void;
};

const ListItemForm = ({ characterName, item, onClose }: ListItemFormProps) => {
  const [state, formAction, isPending] = useActionState(listMarketplaceItemAction, {});

  useEffect(() => {
    if (state.success && onClose) {
      const timer = setTimeout(onClose, 500);
      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="characterName" value={characterName} />
      <input type="hidden" name="slotIndex" value={String(item.slot)} />

      <div className="grid grid-cols-2 gap-2">
        <select name="currencyType" defaultValue="zen" className="input-gold text-xs h-9">
          <option value="zen">Zen</option>
          <option value="credits">Credits</option>
        </select>
        <input className="input-gold text-xs h-9" name="price" type="number" min={1} placeholder="Price" required />
      </div>

      <button type="submit" disabled={isPending} className="btn-gold w-full text-xs h-9">
        {isPending ? "Listing..." : "List on Market"}
      </button>

      {state.message ? <Feedback type={state.success ? "success" : "error"} message={state.message} /> : null}
    </form>
  );
};

export default ListItemForm;
