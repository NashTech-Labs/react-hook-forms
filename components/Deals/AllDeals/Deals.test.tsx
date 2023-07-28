import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { generateStore } from "../../../store";
import "@testing-library/jest-dom";
import Deals from "./Deals";
import { server } from "../../../test/server";
import { rest } from "msw";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const store = generateStore({
  user: {
    userProfile: {
      'name': "Test User"
    }
  }
});

describe("All Deals tests", () => {
  test("Renders all deals list", async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <Deals search={''} />
        </GoogleOAuthProvider>
      </Provider>
    );
    expect(screen.getByTestId("homepage")).toBeInTheDocument();
  });

  test("Renders deal details with view button", async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <Deals search={''} />
        </GoogleOAuthProvider>
      </Provider>
    );
    await screen.findByText("Test deal");
    await screen.findByText("Discount");
    await screen.findByTestId("view-btn");
  });

  test("renders view all deals error screen", async () => {
    const store = generateStore();
    server.use(
      rest.get(
        `https://cs-bo-panel-bff-dev.loblaw.digital/v1/deals`,
        (req, res, ctx) => {
          return res(ctx.status(404));
        }
      )
    );

    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <Deals search={''} />
        </GoogleOAuthProvider>
      </Provider>
    );
    await screen.findByText("Create new");
    await screen.findByText("There are currently no deals to view");
    await screen.findByTestId("createNew-btn");
  });

  test("should land on create new deal page", async () => {
    const push = jest.fn();
    const store = generateStore();

    (useRouter as jest.Mock).mockImplementation(() => ({
      push,
    }));

    server.use(
      rest.get(
        `https://cs-bo-panel-bff-dev.loblaw.digital/v1/deals`,
        (req, res, ctx) => {
          return res(ctx.status(404));
        }
      )
    );

    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <Deals search={''} />
        </GoogleOAuthProvider>
      </Provider>
    );

    await screen.findByText("Create new");
    const backBtn = screen.getByTestId("createNew-btn");
    fireEvent.click(backBtn);
    expect(push).toHaveBeenCalledWith("/deals/create");
  });

  test("should land on view deal page", () => {
    const push = jest.fn();

    (useRouter as jest.Mock).mockImplementation(() => ({
      push,
    }));
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <Deals search={''} />
        </GoogleOAuthProvider>
      </Provider>
    );

    const backBtn = screen.getByTestId("view-btn");
    fireEvent.click(backBtn);
    expect(push).toHaveBeenCalledWith("deals/view");
  });

  test("should open the delete modal on delete button click", () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <Deals search={''} />
        </GoogleOAuthProvider>
      </Provider>
    );

    const rowSelect = screen.getAllByRole("checkbox");
    fireEvent.click(rowSelect[0]);
    const deleteBtn = screen.getByTestId("delete-btn");
    fireEvent.click(deleteBtn);
    expect(
      screen.queryByText("Yes, I understand and would like to proceed.")
    ).toBeInTheDocument();
  });

  test("should close the delete modal on exit button click", () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <Deals search={''} />
        </GoogleOAuthProvider>
      </Provider>
    );

    const rowSelect = screen.getAllByRole("checkbox");
    fireEvent.click(rowSelect[0]);
    const deleteBtn = screen.getByTestId("delete-btn");
    fireEvent.click(deleteBtn);
    fireEvent.click(screen.getByTestId("exitBtn"));
    expect(
      screen.queryByText("Yes, I understand and would like to proceed.")
    ).toBeNull();
  });
});
