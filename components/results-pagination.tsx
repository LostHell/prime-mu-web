import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export function getPaginationHref(
  pathname: string,
  targetPage: number,
  query: Record<string, string> = {},
) {
  const params = new URLSearchParams(query);
  if (targetPage > 1) {
    params.set("page", String(targetPage));
  } else {
    params.delete("page");
  }

  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}

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
  const href = (target: number) => getPaginationHref(pathname, target, query);
  const hasPrevious = page > 1;
  const disabledClassName = "pointer-events-none opacity-50";

  return (
    <Pagination aria-label="Results pages" className="mt-5">
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <PaginationPrevious
            href={href(Math.max(1, page - 1))}
            aria-disabled={!hasPrevious}
            tabIndex={hasPrevious ? undefined : -1}
            prefetch={hasPrevious ? undefined : false}
            className={cn(!hasPrevious && disabledClassName)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={href(page)} isActive size="default">
            Page {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={href(page + 1)}
            aria-disabled={!hasNext}
            tabIndex={hasNext ? undefined : -1}
            prefetch={hasNext ? undefined : false}
            className={cn(!hasNext && disabledClassName)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
