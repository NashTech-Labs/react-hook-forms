import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store, generateStore } from "../../store";
import "@testing-library/jest-dom";
import CreateVoucher from "./CreateVoucher";
import { JOE_FRESH_LOB } from "../../constants/lob";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

describe("Create Voucher tests", () => {
  test("should render all create deal details", async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <CreateVoucher />
        </GoogleOAuthProvider>
      </Provider>
    );
    expect(screen.getByTestId("createDealTitle")).toBeInTheDocument();
  });

  test("Test Create Voucher Discount button", async () => {
    render(
      <Provider store={generateStore({ lob: { lob: JOE_FRESH_LOB } })}>
        <GoogleOAuthProvider clientId={""}>
          <CreateVoucher />
        </GoogleOAuthProvider>
      </Provider>
    );
    expect(screen.getByTestId("createDealTitle")).toBeInTheDocument();

    const clickIndicator = screen.getByTestId("promotional-voucher-btn");
    fireEvent.click(clickIndicator);

    expect(screen.getByTestId("ContinueBtn")).toBeInTheDocument();
  });

  test("Test Cancel Voucher button", async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <CreateVoucher />
        </GoogleOAuthProvider>
      </Provider>
    );
    expect(screen.getByTestId("createDealTitle")).toBeInTheDocument();

    const clickIndicator = screen.getByTestId("CancelBtn");
    fireEvent.click(clickIndicator);

    expect(screen.getByTestId("CancelBtn")).toBeInTheDocument();
  });
});
