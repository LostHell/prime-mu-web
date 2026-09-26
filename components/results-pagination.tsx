import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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
  itemCount,
  pathname,
  query = {},
}: {
  page: number;
  hasNext: boolean;
  itemCount: number;
  pathname: string;
  query?: Record<string, string>;
}) {
  if (itemCount <= 0) {
    return null;
  }

  const href = (target: number) => getPaginationHref(pathname, target, query);
  const hasPrevious = page > 1;
  const disabledClassName = "pointer-events-none opacity-50";

  return (
    <Pagination aria-label="Results pages" className="mt-5">
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <PaginationLink
            href={href(Math.max(1, page - 1))}
            aria-label="Go to previous page"
            aria-disabled={!hasPrevious}
            tabIndex={hasPrevious ? undefined : -1}
            prefetch={hasPrevious ? undefined : false}
            className={cn(!hasPrevious && disabledClassName)}
            size="icon-xs"
          >
            <ChevronLeftIcon aria-hidden />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href={href(page)}
            aria-label={`Page ${page}`}
            isActive
            size="icon-xs"
          >
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href={href(page + 1)}
            aria-label="Go to next page"
            aria-disabled={!hasNext}
            tabIndex={hasNext ? undefined : -1}
            prefetch={hasNext ? undefined : false}
            className={cn(!hasNext && disabledClassName)}
            size="icon-xs"
          >
            <ChevronRightIcon aria-hidden />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
