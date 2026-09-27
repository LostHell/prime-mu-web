import { ActionError, actionErrorMessage } from "./action-error";

describe("actionErrorMessage", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("returns ActionError messages and hides unknown errors", () => {
    expect(
      actionErrorMessage(
        new ActionError("Not enough deposited funds to buy this item."),
        "Failed.",
      ),
    ).toBe("Not enough deposited funds to buy this item.");
    expect(
      actionErrorMessage(
        new Error("Invalid `prisma.accountDeposit.updateMany()`"),
        "Failed.",
      ),
    ).toMatch(/^Failed\. Reference: [\w-]+\.$/);
    expect(actionErrorMessage("nope", "Failed.")).toMatch(
      /^Failed\. Reference:/,
    );
    expect(console.error).toHaveBeenCalled();
  });
});
