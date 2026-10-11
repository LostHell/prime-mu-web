import { describeDailySchedule } from "@/app/server-info/_components/event-schedule-label";
import ServerGuideNav from "@/app/server-info/_components/server-guide-nav";
import SettingRows from "@/app/server-info/_components/setting-rows";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
import { eventSchedules } from "@/constants/events";
import {
  MAX_RESETS,
  MIN_RESET_LEVEL,
  MIN_RESET_MONEY,
  POINTS_PER_RESET,
} from "@/constants/resets";
import {
  DROP_RATE,
  EXPERIENCE_RATE,
  MAX_LEVEL,
  MAX_ONLINE,
  MAX_STAT_POINT,
  SERVER_TIME_ZONE,
  VERSION,
} from "@/constants/server";
import { serverConfig } from "@/lib/game/server-config";
import { formatCompact } from "@/lib/utils/numbers";
import { Download } from "lucide-react";
import Link from "next/link";

const { dw, dk, fe, mg } = serverConfig.character.levelUpPoints;
const sharedLevelUpPoints = dw === dk && dk === fe;

type ServerInfoGuideProps = {
  online: number;
  registered: number;
  guilds: number;
};

const ServerInfoGuide = ({
  online,
  registered,
  guilds,
}: ServerInfoGuideProps) => {
  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <nav aria-label="Server guide">
        <ServerGuideNav />
      </nav>

      <div className="flex flex-col gap-10">
        <section id="glance" className="scroll-mt-8">
          <Text variant="h3" as="h2" className="mb-4">
            At a glance
          </Text>
          <Card>
            <CardContent>
              <SettingRows
                rows={[
                  { label: "Players online", value: formatCompact(online) },
                  {
                    label: "Registered accounts",
                    value: formatCompact(registered),
                  },
                  { label: "Active guilds", value: formatCompact(guilds) },
                  { label: "Max online", value: formatCompact(MAX_ONLINE) },
                ]}
              />
              <Button variant="link" className="mt-4" asChild>
                <Link href="/rankings">View rankings</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section id="server" className="scroll-mt-8">
          <Text variant="h3" as="h2" className="mb-4">
            Server
          </Text>
          <Card>
            <CardContent>
              <SettingRows
                rows={[
                  { label: "Version", value: `${VERSION} Classic` },
                  { label: "Experience", value: EXPERIENCE_RATE },
                  { label: "Drop rate", value: DROP_RATE },
                  { label: "Max level", value: formatCompact(MAX_LEVEL) },
                ]}
              />
            </CardContent>
          </Card>
        </section>

        <section id="resets" className="scroll-mt-8">
          <Text variant="h3" as="h2" className="mb-4">
            Resets
          </Text>
          <Card>
            <CardContent>
              <SettingRows
                rows={[
                  {
                    label: "Reset at",
                    value: `Level ${formatCompact(MIN_RESET_LEVEL)}`,
                  },
                  {
                    label: "Points per reset",
                    value: formatCompact(POINTS_PER_RESET),
                  },
                  {
                    label: "Reset zen",
                    value: `From ${formatCompact(MIN_RESET_MONEY)}`,
                  },
                  { label: "Max resets", value: formatCompact(MAX_RESETS) },
                ]}
              />
              <p className="text-muted-foreground mt-4 text-sm">
                Reach level {formatCompact(MIN_RESET_LEVEL)}, then reset. The
                zen cost rises with each reset, and the points are free to
                assign. A reset returns the character to the class starting
                level.
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="character" className="scroll-mt-8">
          <Text variant="h3" as="h2" className="mb-4">
            Character
          </Text>
          <Card>
            <CardContent>
              <SettingRows
                rows={[
                  ...(sharedLevelUpPoints
                    ? [
                        {
                          label: "Dark Wizard, Dark Knight, Fairy Elf",
                          value: `${formatCompact(dw)} points per level`,
                        },
                      ]
                    : [
                        {
                          label: "Dark Wizard",
                          value: `${formatCompact(dw)} points per level`,
                        },
                        {
                          label: "Dark Knight",
                          value: `${formatCompact(dk)} points per level`,
                        },
                        {
                          label: "Fairy Elf",
                          value: `${formatCompact(fe)} points per level`,
                        },
                      ]),
                  {
                    label: "Magic Gladiator",
                    value: `${formatCompact(mg)} points per level`,
                  },
                  {
                    label: "Stat cap",
                    value: formatCompact(MAX_STAT_POINT),
                  },
                ]}
              />
              <p className="text-muted-foreground mt-4 text-sm">
                Free points can be added to strength, agility, vitality, and
                energy from the site.
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="economy" className="scroll-mt-8">
          <Text variant="h3" as="h2" className="mb-4">
            Economy
          </Text>
          <Card>
            <CardContent>
              <SettingRows
                rows={[
                  {
                    label: "Warehouse zen cap",
                    value: formatCompact(serverConfig.warehouse.maxMoney),
                  },
                  {
                    label: "Clear PK",
                    value: `${formatCompact(serverConfig.pkClear.moneyPerKill)} zen per kill`,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </section>

        <section id="events" className="scroll-mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <Text variant="h3" as="h2">
              Events
            </Text>
            <p className="text-muted-foreground text-sm">{SERVER_TIME_ZONE}</p>
          </div>
          <Card>
            <CardContent>
              <SettingRows
                rows={[
                  {
                    label: "Blood Castle",
                    value: describeDailySchedule(eventSchedules.bloodCastle),
                  },
                  {
                    label: "Devil Square",
                    value: describeDailySchedule(eventSchedules.devilSquare),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </section>

        <section>
          <Text variant="h3" as="h2" className="mb-4">
            Ready to play?
          </Text>
          <Card>
            <CardContent className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-muted-foreground text-sm">
                Download the client, create an account, and log in.
              </p>
              <Button decorative asChild>
                <Link href="/downloads">
                  <Download aria-hidden="true" />
                  Download client
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ServerInfoGuide;
