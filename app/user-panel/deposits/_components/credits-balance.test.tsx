import { render, screen } from "@testing-library/react";
import { CreditsBalance } from "./credits-balance";

test("shows the account's credits and where they come from", () => {
  render(<CreditsBalance credits={1234} />);

  expect(screen.getByText("Credits")).toBeInTheDocument();
  expect(screen.getByText("1,234")).toBeInTheDocument();
  expect(
    screen.getByText(/staying online in Devias town or the Arena/),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /Deposit|Withdraw/ }),
  ).not.toBeInTheDocument();
});
