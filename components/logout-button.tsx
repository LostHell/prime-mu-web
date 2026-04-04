"use client";

import { logoutAction } from "@/actions/logout";
import type { CSSProperties, ReactNode } from "react";
import { useTransition } from "react";

type LogoutButtonProps = {
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  children?: ReactNode;
};

const LogoutButton = ({ className, style, onClick, children }: LogoutButtonProps) => {
  const [, startTransition] = useTransition();

  const handleClick = () => {
    onClick?.();
    startTransition(() => logoutAction());
  };

  return (
    <button type="button" className={className} style={style} onClick={handleClick}>
      {children ?? "Logout"}
    </button>
  );
};

export default LogoutButton;
