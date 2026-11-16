import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";

const renderContact = (contact: string | null) => {
  let element: ReactElement | undefined;
  jest.isolateModules(() => {
    jest.doMock("@/constants/app", () => ({
      ...jest.requireActual("@/constants/app"),
      LEGAL_CONTACT: contact,
    }));
    const { LegalContact } =
      jest.requireActual<typeof import("./legal-document")>("./legal-document");
    element = <LegalContact />;
  });
  return render(<p>{element}</p>);
};

afterEach(() => {
  jest.dontMock("@/constants/app");
});

test("links the contact address as an email", () => {
  renderContact("staff@blackmu.example");

  expect(
    screen.getByRole("link", { name: "staff@blackmu.example" }),
  ).toHaveAttribute("href", "mailto:staff@blackmu.example");
});

test("says the contact is not published while there is none", () => {
  renderContact(null);

  expect(
    screen.getByText("Contact details are not published yet."),
  ).toBeInTheDocument();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
