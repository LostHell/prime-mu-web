"use client";

import { logoutAction } from "@/app/actions/auth-actions";
import type { CSSProperties, ReactNode } from "react";

type LogoutButtonProps = {
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  children?: ReactNode;
};

const LogoutButton = ({ className, style, onClick, children }: LogoutButtonProps) => (
  <form action={logoutAction} className="inline">
    <button type="submit" className={className} style={style} onClick={onClick}>
      {children ?? "Logout"}
    </button>
  </form>
);

export default LogoutButton;
