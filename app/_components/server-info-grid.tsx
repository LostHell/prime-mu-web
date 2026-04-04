import { serverInfo } from "@/lib/mock-data";

const ServerInfoGrid = () => {
  const items = [
    { label: "Version", value: serverInfo.version },
    { label: "Experience", value: serverInfo.experience },
    { label: "Drop", value: serverInfo.drop },
    { label: "Max Level", value: serverInfo.maxLevel },
    { label: "Max Resets", value: serverInfo.maxResets },
    { label: "Points", value: serverInfo.points },
  ];

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="section-title text-center mb-8">Server Information</h2>
        <div className="card-dark p-6 card-hover">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((info) => (
              <div key={info.label} className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">{info.label}</span>
                <span className="font-semibold gold-gradient-text">{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServerInfoGrid;
