import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../../store";
import "@testing-library/jest-dom";
import DealsMainPage from "./DealsMainPage";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Deals MainPage tests", () => {
  test("should render all deal details", () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <DealsMainPage />
        </GoogleOAuthProvider>
      </Provider>
    );
    expect(screen.getByTestId("dealMain-page")).toBeInTheDocument();
  });
});
