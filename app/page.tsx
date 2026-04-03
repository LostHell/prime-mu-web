import Divider from "@/components/divider";
import EventCountdown from "@/components/event-countdown";
import Hero from "@/components/hero";
import ServerInfo from "@/components/server-info";
import {
  bloodCastleRanking,
  classColors,
  devilSquareRanking,
  eventSchedules,
  lastDisconnected,
  serverInfo,
} from "@/lib/mock-data";
import { Shield, Skull } from "lucide-react";

const Home = () => {
  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Server Info */}
      <ServerInfo serverInfo={serverInfo} />

      <Divider />

      {/* Server Info */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="section-title text-center mb-8">Server Information</h2>
          <div className="card-dark p-6 card-hover">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Version", value: serverInfo.version },
                { label: "Experience", value: serverInfo.experience },
                { label: "Drop", value: serverInfo.drop },
                { label: "Max Level", value: serverInfo.maxLevel },
                { label: "Max Resets", value: serverInfo.maxResets },
                { label: "Points", value: serverInfo.points },
              ].map((info) => (
                <div key={info.label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">{info.label}</span>
                  <span className="font-semibold" style={{ color: "hsl(var(--gold))" }}>
                    {info.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Rankings Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Devil Square */}
            <div className="card-dark p-6 card-hover">
              <div className="flex items-center gap-3 mb-2">
                <Skull className="w-6 h-6" style={{ color: "hsl(var(--gold))" }} />
                <h3 className="section-title">Devil Square</h3>
              </div>
              <div className="flex justify-end mb-4">
                <EventCountdown
                  scheduleHours={eventSchedules.devilSquare}
                  color="hsl(var(--gold))"
                />
              </div>
              <div className="ornament-line mb-4" />
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="table-header-cell">#</th>
                    <th className="table-header-cell">Name</th>
                    <th className="table-header-cell text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {devilSquareRanking.map((entry, i) => (
                    <tr key={i} className="border-b border-border/50 table-row-hover">
                      <td
                        className="table-body-cell text-gold"
                        style={{ color: "hsl(var(--gold))" }}
                      >
                        {entry.rank}
                      </td>
                      <td className={`table-body-cell font-medium ${classColors[entry.class]}`}>
                        {entry.name}
                      </td>
                      <td className="table-body-cell">{entry.score.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Blood Castle */}
            <div className="card-dark p-6 card-hover">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-6 h-6" style={{ color: "hsl(var(--crimson))" }} />
                <h3 className="section-title">Blood Castle</h3>
              </div>
              <div className="flex justify-end mb-4">
                <EventCountdown
                  scheduleHours={eventSchedules.bloodCastle}
                  color="hsl(var(--crimson))"
                />
              </div>
              <div className="ornament-line mb-4" />
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="table-header-cell">#</th>
                    <th className="table-header-cell">Name</th>
                    <th className="table-header-cell text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodCastleRanking.map((entry, i) => (
                    <tr key={i} className="border-b border-border/50 table-row-hover">
                      <td className="table-body-cell" style={{ color: "hsl(var(--gold))" }}>
                        {entry.rank}
                      </td>
                      <td className={`table-body-cell font-medium ${classColors[entry.class]}`}>
                        {entry.name}
                      </td>
                      <td className="table-body-cell">{entry.score.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Last Disconnected */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="section-title text-center mb-8">Last Disconnected Players</h2>
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
                {lastDisconnected.map((user, i) => (
                  <tr key={i} className="border-b border-border/50 table-row-hover">
                    <td className={`table-body-cell font-medium  ${classColors[user.class]}`}>
                      {user.name}
                    </td>
                    <td className="">{user.map}</td>

                    <td className="table-body-cell text-muted-foreground">{user.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Divider />
    </>
  );
};

export default Home;
