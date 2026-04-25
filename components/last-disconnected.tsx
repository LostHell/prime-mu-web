import { getLastDisconnected } from "@/lib/queries/get-last-disconnected";
import { CLASS_TEXT_COLOR } from "@/lib/types/character";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

const LastDisconnectedRows = async () => {
  const lastDisconnected = await getLastDisconnected();
  return (
    <tbody>
      {lastDisconnected.map((user) => (
        <tr
          key={user.name}
          className="border-border/50 table-row-hover border-b"
        >
          <td
            className={cn(
              "table-body-cell font-medium",
              CLASS_TEXT_COLOR[user.class],
            )}
          >
            {user.name}
          </td>
          <td className="table-body-cell">{user.map}</td>
          <td className="table-body-cell text-muted-foreground">{user.time}</td>
        </tr>
      ))}
    </tbody>
  );
};

const RowsSkeleton = () => (
  <tbody>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="border-border/50 border-b">
        <td className="table-body-cell">
          <div className="bg-muted h-4 w-28 animate-pulse rounded" />
        </td>
        <td className="table-body-cell">
          <div className="bg-muted h-4 w-24 animate-pulse rounded" />
        </td>
        <td className="table-body-cell">
          <div className="bg-muted ml-auto h-4 w-16 animate-pulse rounded" />
        </td>
      </tr>
    ))}
  </tbody>
);

const LastDisconnected = () => {
  return (
    <div className="card-dark card-hover p-6">
      <table className="w-full">
        <thead>
          <tr className="border-border border-b">
            <th className="table-header-cell">Name</th>
            <th className="table-header-cell">Map</th>
            <th className="table-header-cell">Time</th>
          </tr>
        </thead>
        <Suspense fallback={<RowsSkeleton />}>
          <LastDisconnectedRows />
        </Suspense>
      </table>
    </div>
  );
};

export default LastDisconnected;
