import { characterClassShortName } from "./class-name";

test("gives every class its short name, and an unknown class its name", () => {
  expect(characterClassShortName("Dark Wizard")).toBe("DW");
  expect(characterClassShortName("Soul Master")).toBe("SM");
  expect(characterClassShortName("Dark Knight")).toBe("DK");
  expect(characterClassShortName("Blade Knight")).toBe("BK");
  expect(characterClassShortName("Fairy Elf")).toBe("FE");
  expect(characterClassShortName("Muse Elf")).toBe("ME");
  expect(characterClassShortName("Magic Gladiator")).toBe("MG");
  expect(characterClassShortName("Unknown")).toBe("Unknown");
});
