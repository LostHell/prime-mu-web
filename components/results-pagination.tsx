import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ResultsPagination({
  page,
  hasNext,
  pathname,
  query = {},
}: {
  page: number;
  hasNext: boolean;
  pathname: string;
  query?: Record<string, string>;
}) {
  const href = (target: number) =>
    `${pathname}?${new URLSearchParams({ ...query, page: String(target) })}`;
  return (
    <nav
      aria-label="Results pages"
      className="mt-5 flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-muted-foreground text-sm">Page {page}</p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Button variant="outline" asChild>
            <Link href={href(page - 1)}>Previous</Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Previous
          </Button>
        )}
        {hasNext ? (
          <Button variant="outline" asChild>
            <Link href={href(page + 1)}>Next</Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Next
          </Button>
        )}
      </div>
    </nav>
  );
}
