"use client";

import { useState } from "react";
import { Button } from "./button";

interface ConfirmActionProps {
  label: string;
  description: string;
  buttonLabel: string;
  onConfirm: () => void;
  disabled?: boolean;
}

const ConfirmAction = ({
  label,
  description,
  buttonLabel,
  onConfirm,
  disabled,
}: ConfirmActionProps) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
      {!confirmed ? (
        <Button onClick={() => setConfirmed(true)} disabled={disabled}>
          {label}
        </Button>
      ) : (
        <div className="space-y-3">
          <p
            className="text-sm text-center font-semibold uppercase tracking-widest"
          >
            Are you sure? This cannot be undone.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setConfirmed(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmed(false);
                onConfirm();
              }}
              disabled={disabled}
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmAction;
