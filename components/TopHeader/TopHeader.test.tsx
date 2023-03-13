import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { generateStore } from "../../store";
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

const store = generateStore({
  user: {
    token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVkZjFmOTQ1ZmY5MDZhZWFlZmE5M2MyNzY5OGRiNDA2ZDYwNmIwZTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2Nzg3MDk1ODgsImF1ZCI6Ijg5NDkzMjIxOTg0MS05ZXAxM2d0OTFoajNqbjVtMHNvZmNsM2doMDVkZ2J0Zy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMjk5NDIxOTA1MDUyODg2NDg1MSIsImhkIjoibG9ibGF3LmNhIiwiZW1haWwiOiJwdXNocGVuZHJhLnNoYXJtYUBsb2JsYXcuY2EiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiODk0OTMyMjE5ODQxLTllcDEzZ3Q5MWhqM2puNW0wc29mY2wzZ2gwNWRnYnRnLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibmFtZSI6IlB1c2hwZW5kcmEgU2hhcm1hIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FHTm15eFp6eloxbGNBYkh3YjY2U19iel9TU0c0TUQ3V2RGZEVHM1hFdTZSPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlB1c2hwZW5kcmEiLCJmYW1pbHlfbmFtZSI6IlNoYXJtYSIsImlhdCI6MTY3ODcwOTg4OCwiZXhwIjoxNjc4NzEzNDg4LCJqdGkiOiIwYjQxNThlNmEwMGJkNTZiODdhNmJhMjQzYmFiMmQxNzA1Yzc2NTI5In0.Wa50n1y5YlsM_XVfRq0F-eaKewjvaXuhJKf_Xd1FErRh8oF11dZdEgwFK34UaCgD-gXymdBpYQ7k5UdTv8fzi8xeX8_liIfM-U24HsSJHHynym1cV8OC2pO2hdTuKLqHqjXwW9sHj0mkaiqxvP53sytXG_TEo2XcfsHv4RbYymYKhyJspBIBZwKiH2RKBCefyjvI_te56cW2lVkWdLC5U1dF-dBVB7rx7UDKv_QJk0llQGIGov-1Uw5sPD812KFqALhmnfVmdM6C-xgSkai-q5cJZBRJ0rGX6sR8Mwn4LTEaT-q7JLOmDDRt6R0TJTv8PwgoTJWAOwF2pCvpRkBAiA",
    role: {
      roles: ["CS_ADMIN", "BO_ADMIN"]
    }
  },
});


describe("TopHeader Tests", () => {
  test("Renders TopHeader component", async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <TopHeader />
        </GoogleOAuthProvider>
      </Provider>
    );
    expect(screen.getByTestId("topHeader")).toBeInTheDocument();
  })

  test("Enable Sign Out", async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <TopHeader />
        </GoogleOAuthProvider>
      </Provider>
    );
    const enableSignOut = await screen.findByTestId("enableSignOut");
    fireEvent.click(enableSignOut);
    expect(screen.queryByText("Sign Out")).toBeTruthy();

    const viewDetailBtn = await screen.findByTestId("signOut");
    fireEvent.click(viewDetailBtn);
    expect(screen.queryByText("Sign Out")).toBeNull();
  })
});