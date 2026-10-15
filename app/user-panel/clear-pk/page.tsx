import type { Metadata } from "next";
import { ClearPkPage } from "./_components/clear-pk-page";

export const metadata: Metadata = {
  title: "Clear PK",
};

export default function Page() {
  return <ClearPkPage />;
}
