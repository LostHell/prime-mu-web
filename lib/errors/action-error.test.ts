import { ActionError, actionErrorMessage } from "./action-error";

describe("actionErrorMessage", () => {
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
    ).toBe("Failed.");
    expect(actionErrorMessage("nope", "Failed.")).toBe("Failed.");
  });
});
