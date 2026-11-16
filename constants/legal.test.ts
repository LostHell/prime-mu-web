const loadLegal = (contact: string | null) => {
  let legal: typeof import("./legal") | undefined;
  jest.isolateModules(() => {
    jest.doMock("./app", () => ({ LEGAL_CONTACT: contact }));
    legal = jest.requireActual<typeof import("./legal")>("./legal");
  });
  return legal!;
};

afterEach(() => {
  jest.dontMock("./app");
});

test("links only the rules while there is no contact", () => {
  const legal = loadLegal(null);

  expect(legal.LEGAL_PAGES_PUBLISHED).toBe(false);
  expect(legal.LEGAL_LINKS.map((link) => link.href)).toEqual(["/rules"]);
});

test("publishes the terms and the privacy policy once a contact is set", () => {
  const legal = loadLegal("staff@blackmu.example");

  expect(legal.LEGAL_PAGES_PUBLISHED).toBe(true);
  expect(legal.LEGAL_LINKS.map((link) => link.href)).toEqual([
    "/rules",
    "/terms",
    "/privacy",
  ]);
});
