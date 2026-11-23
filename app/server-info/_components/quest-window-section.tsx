import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
import type { PublicQuestGroup } from "@/lib/game/quests/describe-quest-window";
import { ChevronDown } from "lucide-react";

type QuestWindowSectionProps = {
  groups: PublicQuestGroup[];
};

/** The quests of the in-game quest window (T), in blocks that open one at a time. */
export const QuestWindowSection = ({ groups }: QuestWindowSectionProps) => {
  const total = groups.reduce((sum, group) => sum + group.quests.length, 0);

  return (
    <section id="quests" className="scroll-mt-8">
      <Text variant="h3" as="h2" className="mb-4">
        Quests
      </Text>
      <Card>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Press T in the game to open the quest window. It holds {total}{" "}
            quests that open one after another: take the quest, slay the
            monsters, then claim the reward in the window.
          </p>
          <div className="divide-border/50 mt-4 divide-y">
            {groups.map((group) => (
              <details
                key={group.title}
                className="group py-3 first:pt-0 last:pb-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-medium [&::-webkit-details-marker]:hidden">
                  {group.title}
                  <ChevronDown
                    className="size-icon-sm text-muted-foreground shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <ol className="mt-3 flex flex-col gap-3">
                  {group.quests.map((quest) => (
                    <li
                      key={quest.number}
                      className="border-border/50 rounded-md border p-3"
                    >
                      <p className="text-sm font-semibold">
                        <span className="text-gold">Quest {quest.number}</span>{" "}
                        · {quest.name}
                      </p>
                      <dl className="mt-2 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[6rem_minmax(0,1fr)]">
                        <dt className="text-muted-foreground">To start</dt>
                        <dd>{quest.requirement}</dd>
                        <dt className="text-muted-foreground">Task</dt>
                        <dd>
                          <ul>
                            {quest.objectives.map((objective) => (
                              <li key={objective.text}>
                                {objective.text}
                                {objective.where ? (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    · {objective.where}
                                  </span>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </dd>
                        <dt className="text-muted-foreground">Reward</dt>
                        <dd>
                          <ul>
                            {quest.rewards.map((reward) => (
                              <li key={reward}>{reward}</li>
                            ))}
                          </ul>
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
