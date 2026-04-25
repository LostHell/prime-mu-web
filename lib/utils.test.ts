import { cn } from "@/lib/utils";

describe("cn()", () => {
  test("merges classes and resolves conflicts", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
