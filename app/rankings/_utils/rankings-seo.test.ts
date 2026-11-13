import { getRankingsSeo } from "./rankings-seo";

test("indexes the player rankings at the clean url", () => {
  const seo = getRankingsSeo({});

  expect(seo.title).toBe("Player rankings");
  expect(seo.metadata.alternates).toEqual({ canonical: "/rankings" });
  expect(seo.metadata.robots).toBeUndefined();
});

test("keeps a paginated player page indexable at its own url", () => {
  const seo = getRankingsSeo({ page: "2" });

  expect(seo.metadata.alternates).toEqual({ canonical: "/rankings?page=2" });
  expect(seo.metadata.robots).toBeUndefined();
});

test("gives each ranking view its own title and canonical", () => {
  expect(getRankingsSeo({ view: "guilds" })).toMatchObject({
    title: "Guild rankings",
    metadata: { alternates: { canonical: "/rankings?view=guilds" } },
  });
  expect(getRankingsSeo({ view: "online", page: "3" })).toMatchObject({
    title: "Online players",
    metadata: { alternates: { canonical: "/rankings?view=online&page=3" } },
  });
  expect(getRankingsSeo({ view: "events", page: "2" })).toMatchObject({
    title: "Event rankings",
    metadata: { alternates: { canonical: "/rankings?view=events" } },
  });
});

test("does not index a name search or a class filter", () => {
  const searched = getRankingsSeo({ query: "black" });
  const filtered = getRankingsSeo({ view: "online", class: "0", page: "2" });

  expect(searched.metadata.robots).toEqual({ index: false, follow: true });
  expect(searched.metadata.alternates).toEqual({ canonical: "/rankings" });
  expect(filtered.metadata.robots).toEqual({ index: false, follow: true });
  expect(filtered.metadata.alternates).toEqual({
    canonical: "/rankings?view=online&page=2",
  });
});

test("treats a blank search as the unfiltered view", () => {
  const seo = getRankingsSeo({ view: "guilds", query: "   ", class: " " });

  expect(seo.metadata.robots).toBeUndefined();
  expect(seo.metadata.alternates).toEqual({
    canonical: "/rankings?view=guilds",
  });
});

test("treats an unknown view as the player rankings", () => {
  const seo = getRankingsSeo({ view: "bosses" });

  expect(seo.title).toBe("Player rankings");
  expect(seo.metadata.alternates).toEqual({ canonical: "/rankings" });
});
