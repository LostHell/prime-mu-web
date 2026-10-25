import { searchableItemName } from "./index";

test("stores the definition name without an excellent prefix or level suffix", () => {
  expect(searchableItemName({ group: 0, index: 0, level: 9 })).toBe("Kris");
});

test("stores the Box of Luck name for that level", () => {
  expect(searchableItemName({ group: 14, index: 11, level: 8 })).toBe(
    "Box of Kundun +1",
  );
});

test("uses Unknown item when there is no definition", () => {
  expect(searchableItemName({ group: 14, index: 11, level: 4 })).toBe(
    "Unknown item",
  );
  expect(searchableItemName({ group: 99, index: 0, level: 0 })).toBe(
    "Unknown item",
  );
});
