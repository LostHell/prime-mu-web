import { auth } from "@/auth";
import { getAccountCredits } from "@/lib/queries/get-credits";
import { getAccountDepositAmounts } from "@/lib/queries/get-deposits";
import { getAllActiveListings } from "@/lib/queries/get-marketplace-listings";
import MarketPage from "./page";

jest.mock("./_components/market-browse", () => ({
  MarketBrowse: () => null,
}));
jest.mock("./_components/market-layout", () => ({
  MarketLayout: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/components/search-results-pagination", () => ({
  SearchResultsPagination: () => null,
  getPaginationHref: jest.fn(),
}));
jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/queries/get-marketplace-listings", () => ({
  getAllActiveListings: jest.fn(),
}));
jest.mock("@/lib/queries/get-deposits", () => ({
  getAccountDepositAmounts: jest.fn(),
}));
jest.mock("@/lib/queries/get-credits", () => ({
  getAccountCredits: jest.fn(),
}));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  jest.clearAllMocks();
  (auth as jest.Mock).mockResolvedValue({ user: { id: "acc" } });
  (getAccountDepositAmounts as jest.Mock).mockResolvedValue({});
  (getAccountCredits as jest.Mock).mockResolvedValue(0);
});

test("loads the catalogue before the buyer's balances", async () => {
  let releaseListings: (value: unknown) => void = () => {};
  (getAllActiveListings as jest.Mock).mockReturnValue(
    new Promise((resolve) => {
      releaseListings = resolve;
    }),
  );

  const pending = MarketPage({ searchParams: Promise.resolve({}) });
  await flush();

  expect(getAllActiveListings).toHaveBeenCalledWith("acc", 1, "");
  expect(getAccountDepositAmounts).not.toHaveBeenCalled();
  expect(getAccountCredits).not.toHaveBeenCalled();

  releaseListings({ items: [], total: 0, hasNext: false });
  await pending;

  expect(getAccountDepositAmounts).toHaveBeenCalledWith("acc");
  expect(getAccountCredits).toHaveBeenCalledWith("acc");
});
