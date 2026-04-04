import { getLastDisconnected } from "@/app/_lib/get-last-disconnected";
import { CLASS_TEXT_COLOR } from "@/lib/types/character";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

const LastDisconnectedRows = async () => {
  const lastDisconnected = await getLastDisconnected();
  return (
    <tbody>
      {lastDisconnected.map((user) => (
        <tr key={user.name} className="border-b border-border/50 table-row-hover">
          <td className={cn("table-body-cell font-medium", CLASS_TEXT_COLOR[user.class])}>{user.name}</td>
          <td className="table-body-cell">{user.map}</td>
          <td className="table-body-cell text-right text-muted-foreground">{user.time}</td>
        </tr>
      ))}
    </tbody>
  );
};

const RowsSkeleton = () => (
  <tbody>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="border-b border-border/50">
        <td className="table-body-cell">
          <div className="h-4 w-28 bg-muted animate-pulse rounded" />
        </td>
        <td className="table-body-cell">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        </td>
        <td className="table-body-cell text-right">
          <div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" />
        </td>
      </tr>
    ))}
  </tbody>
);

const LastDisconnected = () => {
  return (
    <div className="card-dark p-6 card-hover">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="table-header-cell">Name</th>
            <th className="table-header-cell">Map</th>
            <th className="table-header-cell text-right">Time</th>
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
