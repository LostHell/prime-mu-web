import { onlineMapName } from "./online-map-name";

jest.mock("@/lib/game/constants/maps", () => ({
  MAP_NAME_BY_ID: {
    0: "Lorencia",
    2: "Davias",
    9: "Devil Square 1",
    11: "Blood Castle 1",
    16: "Blood Castle 6",
  },
}));

test("names a map as synced, and the events' arenas BC and DS without their level", () => {
  expect(onlineMapName(0)).toBe("Lorencia");
  expect(onlineMapName(2)).toBe("Davias");
  expect(onlineMapName(9)).toBe("DS");
  expect(onlineMapName(11)).toBe("BC");
  expect(onlineMapName(16)).toBe("BC");
});

test("gives nothing for a map it does not know", () => {
  expect(onlineMapName(200)).toBeUndefined();
  expect(onlineMapName(null)).toBeUndefined();
  expect(onlineMapName(undefined)).toBeUndefined();
});
