import { getLastDisconnected } from "@/app/_lib/get-last-disconnected";
import { CLASS_TEXT_COLOR } from "@/lib/types/character";
import { cn } from "@/lib/utils";

const LastDisconnected = async () => {
  const lastDisconnected = await getLastDisconnected();

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
        <tbody>
          {lastDisconnected.map((user) => (
            <tr key={user.name} className="border-b border-border/50 table-row-hover">
              <td className={cn("table-body-cell font-medium", CLASS_TEXT_COLOR[user.class])}>{user.name}</td>
              <td className="table-body-cell">{user.map}</td>
              <td className="table-body-cell text-muted-foreground">{user.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LastDisconnected;
