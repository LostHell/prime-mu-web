import { act, renderHook } from "@testing-library/react";
import { startTransition } from "react";
import { depositAction } from "@/lib/actions/deposit";
import { useDeposits } from "./use-deposits";

jest.mock("@/lib/actions/deposit", () => ({ depositAction: jest.fn() }));
jest.mock("@/lib/actions/withdraw", () => ({ withdrawAction: jest.fn() }));

test("keeps failed transfers open, clears old errors when reopened, and closes on success", async () => {
  jest
    .mocked(depositAction)
    .mockResolvedValueOnce({ success: false, message: "Not enough Zen." })
    .mockResolvedValueOnce({ success: true, message: "Deposited." });
  const { result } = renderHook(() =>
    useDeposits({ isOffline: true, items: [] }),
  );
  act(() => result.current.transfer.open("deposit", "zen"));
  await act(async () => {
    startTransition(() => result.current.transfer.submit(new FormData()));
  });
  expect(result.current.transfer.isOpen).toBe(true);
  expect(result.current.transfer.errorMessage).toBe("Not enough Zen.");
  act(() => result.current.transfer.onOpenChange(false));
  act(() => result.current.transfer.open("deposit", "zen"));
  expect(result.current.transfer.errorMessage).toBeUndefined();
  await act(async () => {
    startTransition(() => result.current.transfer.submit(new FormData()));
  });
  expect(result.current.transfer.isOpen).toBe(false);
  expect(result.current.pageMessage?.text).toBe("Deposited.");
});
