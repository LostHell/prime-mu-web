import { auth } from "@/auth";
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

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  jest.clearAllMocks();
  (auth as jest.Mock).mockResolvedValue({ user: { id: "acc" } });
  (getAccountDepositAmounts as jest.Mock).mockResolvedValue({});
});

test("loads the catalogue before the buyer's balance", async () => {
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

  releaseListings({ items: [], total: 0, hasNext: false });
  await pending;

  expect(getAccountDepositAmounts).toHaveBeenCalledWith("acc");
});
