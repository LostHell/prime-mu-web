import { cn } from "@/lib/utils";

type ServerStatusProps = {
  status?: "online" | "offline";
  className?: string;
};

const ServerStatus = ({ status, className }: ServerStatusProps) => {
  const serverText = `Server ${status === "online" ? "Online" : "Offline"}`;

  return (
    <div
      className={cn("mb-6 flex items-center justify-center gap-2", className)}
    >
      <span className="relative flex h-2.5 w-2.5">
        {status === "online" && (
          <span className="bg-online absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            status === "online" ? "bg-online" : "bg-crimson"
          }`}
        />
      </span>
      <span
        className={`text-xs font-semibold tracking-widest uppercase ${
          status === "online" ? "text-online" : "text-crimson"
        }`}
      >
        {serverText}
      </span>
    </div>
  );
};

export default ServerStatus;
