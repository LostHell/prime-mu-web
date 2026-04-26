import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
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
    <Card>
      <CardContent>
      <Text variant="h2" className="mb-6 text-center">
        Server Information
      </Text>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((info) => (
          <div key={info.label} className="flex justify-between">
            <span>{info.label}</span>
            <span className="gold-gradient-text font-semibold">
              {info.value}
            </span>
          </div>
        ))}
      </div>
      </CardContent>
    </Card>
  );
};

export default ServerInfoGrid;
