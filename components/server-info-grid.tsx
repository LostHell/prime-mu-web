import {
  MAX_RESETS,
  MIN_RESET_LEVEL,
  POINTS_PER_RESET,
  VERSION,
} from "@/constants/resets";

const ServerInfoGrid = () => {
  const items = [
    { label: "Version", value: VERSION },

    { label: "Max Level", value: MIN_RESET_LEVEL },
    { label: "Max Resets", value: MAX_RESETS },
    { label: "Points", value: POINTS_PER_RESET },
  ];

  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="section-title mb-8 text-center">Server Information</h2>
        <div className="card-dark card-hover p-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((info) => (
              <div
                key={info.label}
                className="border-border flex justify-between border-b pb-2"
              >
                <span>{info.label}</span>
                <span className="gold-gradient-text font-semibold">
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServerInfoGrid;
