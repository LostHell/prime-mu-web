import { getBaseClass, getClassKey } from "./class";

test("maps second classes to their base class", () => {
  expect(getBaseClass(17)).toBe(16);
  expect(getBaseClass(48)).toBe(48);
});

test("maps a base class to its server config key", () => {
  expect(getClassKey(1)).toBe("dw");
  expect(getClassKey(48)).toBe("mg");
  expect(getClassKey(99)).toBeNull();
});
