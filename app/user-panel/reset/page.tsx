import type { Metadata } from "next";
import { ResetPage } from "./_components/reset-page";

export const metadata: Metadata = {
  title: "Reset Character",
};

export default function Page() {
  return <ResetPage />;
}
