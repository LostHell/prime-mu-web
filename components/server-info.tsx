import { type ServerInfo as ServerInfoType } from "@/types/server-info";
import { Crown, Star, Swords, Users } from "lucide-react";
import { FC } from "react";

type ServerInfoProps = {
  serverInfo: ServerInfoType;
};

const ServerInfo: FC<ServerInfoProps> = ({ serverInfo }) => {
  const percentage = Math.min(Math.round((serverInfo.online / serverInfo.maxOnline) * 100), 100);

  const widthClass = {
    0: "w-0",
    10: "w-[10%]",
    20: "w-[20%]",
    30: "w-[30%]",
    40: "w-[40%]",
    50: "w-1/2",
    60: "w-[60%]",
    70: "w-[70%]",
    80: "w-[80%]",
    90: "w-[90%]",
    100: "w-full",
  }[Math.round(percentage / 10) * 10];

  const animationDelay = ["delay-100", "delay-200", "delay-300"];

  return (
    <section className="py-12 -mt-20 relative z-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Online Players — with capacity progress bar */}
          <div className="stat-card card-hover animate-fade-up delay-0 p-6">
            <Users className="w-6 h-6 mx-auto mb-2 text-gold" />
            <div className="text-2xl font-bold gold-gradient-text">
              {serverInfo.online}
              <span className="text-sm font-normal text-muted-foreground">&nbsp;/&nbsp;{serverInfo.maxOnline}</span>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Online</div>
            {/* Capacity bar */}

            <div className="h-1 w-full rounded-full overflow-hidden bg-muted">
              <div className={`h-full rounded-full bg-linear-to-r from-gold-dim to-gold-glow ${widthClass}`} />
            </div>
          </div>

          {[
            { icon: Crown, label: "Registered", value: serverInfo.registered.toLocaleString() },
            { icon: Star, label: "Experience", value: serverInfo.experience },
            { icon: Swords, label: "Drop Rate", value: serverInfo.drop },
          ].map((stat, i) => (
            <div key={i} className={`stat-card card-hover animate-fade-up p-6 ${animationDelay[i]}`}>
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-gold" />
              <div className="text-2xl font-bold gold-gradient-text">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServerInfo;
