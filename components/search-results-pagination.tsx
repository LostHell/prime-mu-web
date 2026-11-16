import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export function getPaginationHref(
  pathname: string,
  targetPage: number,
  searchParams: Record<string, string> = {},
) {
  const params = new URLSearchParams(searchParams);
  if (targetPage > 1) {
    params.set("page", String(targetPage));
  } else {
    params.delete("page");
  }

  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}

/** Previous or next page. With nowhere to go it is not a link, so crawlers do not follow it to a page that redirects. */
function PageStep({
  href,
  label,
  children,
}: {
  href: string | null;
  label: string;
  children: React.ReactNode;
}) {
  if (href === null) {
    return (
      <span
        role="link"
        aria-label={label}
        aria-disabled="true"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "pointer-events-none opacity-50",
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <PaginationLink href={href} aria-label={label} size="icon-xs">
      {children}
    </PaginationLink>
  );
}

export function SearchResultsPagination({
  page,
  hasNext,
  pathname,
  searchParams = {},
}: {
  page: number;
  hasNext: boolean;
  pathname: string;
  searchParams?: Record<string, string>;
}) {
  const href = (target: number) =>
    getPaginationHref(pathname, target, searchParams);

  return (
    <Pagination aria-label="Results pages" className="mt-5">
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <PageStep
            href={page > 1 ? href(page - 1) : null}
            label="Go to previous page"
          >
            <ChevronLeftIcon aria-hidden />
          </PageStep>
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
          <PageStep
            href={hasNext ? href(page + 1) : null}
            label="Go to next page"
          >
            <ChevronRightIcon aria-hidden />
          </PageStep>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
