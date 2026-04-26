import { Card } from "@/components/ui/card";
import { getServerInfo } from "@/lib/queries/get-server-info";
import { Crown, Star, Swords, Users } from "lucide-react";

const ServerInfo = async () => {
  const serverInfo = await getServerInfo();

  const percentage = Math.min(
    Math.round((serverInfo.online / serverInfo.maxOnline) * 100),
    100,
  );

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
    <section className="py-12">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Online Players — with capacity progress bar */}
        <Card className="card-hover gap-0 p-6 text-center">
          <Users className="text-gold mx-auto mb-2 h-6 w-6" />
          <div className="gold-gradient-text text-2xl font-bold">
            {serverInfo.online}
            <span className="text-muted-foreground text-sm font-normal">
              &nbsp;/&nbsp;{serverInfo.maxOnline}
            </span>
          </div>
          <div className="text-muted-foreground mb-2 text-xs tracking-widest uppercase">
            Online
          </div>
          {/* Capacity bar */}

          <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
            <div
              className={`from-gold-dim to-gold-glow h-full rounded-full bg-linear-to-r ${widthClass}`}
            />
          </div>
        </Card>

        {[
          {
            icon: Crown,
            label: "Registered",
            value: serverInfo.registered.toLocaleString(),
          },
          { icon: Star, label: "Experience", value: serverInfo.experience },
          { icon: Swords, label: "Drop Rate", value: serverInfo.drop },
        ].map((stat, i) => (
          <Card
            key={i}
            className={`card-hover animate-fade-up gap-0 p-6 text-center ${animationDelay[i]}`}
          >
            <stat.icon className="text-gold mx-auto mb-2 h-6 w-6" />
            <div className="gold-gradient-text text-2xl font-bold">
              {stat.value}
            </div>
            <div className="text-muted-foreground text-xs tracking-widest uppercase">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ServerInfo;
