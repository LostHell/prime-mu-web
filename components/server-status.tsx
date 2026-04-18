import { FC } from "react";

type ServerStatusProps = {
  status?: "online" | "offline";
};

const ServerStatus: FC<ServerStatusProps> = ({ status }) => {
  const serverText = `Server ${status === "online" ? "Online" : "Offline"}`;

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <span className="relative flex h-2.5 w-2.5">
        {status === "online" && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-online" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            status === "online" ? "bg-online" : "bg-crimson"
          }`}
        />
      </span>
      <span
        className={`text-xs font-semibold uppercase tracking-widest ${
          status === "online" ? "text-online" : "text-crimson"
        }`}
      >
        {serverText}
      </span>
    </div>
  );
};

export default ServerStatus;
