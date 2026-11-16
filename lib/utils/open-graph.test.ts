import { openGraphFor, SITE_OPEN_GRAPH } from "./open-graph";

test("keeps the site's name, image and locale and adds the page's own url", () => {
  expect(openGraphFor("/rankings?view=guilds")).toEqual({
    ...SITE_OPEN_GRAPH,
    url: "/rankings?view=guilds",
  });
  expect(SITE_OPEN_GRAPH).toMatchObject({
    siteName: "Black MU",
    images: [{ url: "/hero-banner.jpg", width: 1920, height: 1080 }],
  });
});
