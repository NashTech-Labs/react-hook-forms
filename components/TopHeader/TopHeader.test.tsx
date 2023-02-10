import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../../store";
import "@testing-library/jest-dom";
import TopHeader from "./TopHeader";

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

describe("TopHeader Tests", () => {
  test("Renders TopHeader component", async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <TopHeader/>
        </GoogleOAuthProvider>
      </Provider>
    );
    expect(screen.getByTestId("topHeader")).toBeInTheDocument();
  })
});