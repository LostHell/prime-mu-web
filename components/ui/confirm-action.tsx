"use client";

import { useState } from "react";

interface ConfirmActionProps {
  label: string;
  description: string;
  buttonLabel: string;
  buttonColor: string;
  onConfirm: () => void;
  disabled?: boolean;
}

export function ConfirmAction({
  label,
  description,
  buttonLabel,
  buttonColor,
  onConfirm,
  disabled,
}: ConfirmActionProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
      {!confirmed ? (
        <button
          className="btn-outline w-full"
          style={{ borderColor: buttonColor, color: buttonColor }}
          onClick={() => setConfirmed(true)}
          disabled={disabled}
        >
          {label}
        </button>
      ) : (
        <div className="space-y-3">
          <p
            className="text-sm text-center font-semibold uppercase tracking-widest"
            style={{ color: buttonColor }}
          >
            Are you sure? This cannot be undone.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              className="btn-outline"
              onClick={() => setConfirmed(false)}
            >
              Cancel
            </button>
            <button
              className="btn-outline"
              style={{
                borderColor: buttonColor,
                color: buttonColor,
                background: `${buttonColor}18`,
              }}
              onClick={() => {
                setConfirmed(false);
                onConfirm();
              }}
              disabled={disabled}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
