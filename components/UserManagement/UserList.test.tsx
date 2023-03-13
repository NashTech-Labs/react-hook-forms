import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { generateStore, store } from "../../store";
import "@testing-library/jest-dom";
import { server } from "../../test/server";
import { rest } from "msw";
import UserList from "./UserList";

describe("RolesPermissions tests", () => {
  test("Renders user rows with edit access button", async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <UserList />
        </GoogleOAuthProvider>
      </Provider>
    );
    await screen.findByText("mytest@gmail.com");
    await screen.findByText("BO_ADMIN");
    await screen.findByTestId("edit-user-access-btn");
  });

  test("renders roles and permissions error screen", async () => {
    const store = generateStore();
    server.use(
      rest.get(
        `https://cs-bo-panel-bff-dev.loblaw.digital/v1/roles/getAllUsers`,
        (req, res, ctx) => {
          return res(ctx.status(404));
        }
      )
    );

    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
        <UserList />
        </GoogleOAuthProvider>
      </Provider>
    );
    await screen.findByText("This information is not available at this time.");
  });

  test("Renders add user modal when add is clicked", async() => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
        <UserList />
        </GoogleOAuthProvider>
      </Provider>
    );

    const addUserBtn = await screen.findByText("Add user");
    fireEvent.click(addUserBtn);
    const modalOutput  = screen.getByTestId("addUserModal");
    expect(modalOutput).toBeInTheDocument();
  });

  test("closes the modal on close icon click", async() => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
        <UserList />
        </GoogleOAuthProvider>
      </Provider>
    );
    fireEvent.click(await screen.findByText("Add user"));
    const closeIcon = screen.getByTestId("closeIcon")
    fireEvent.click(closeIcon);
    const modalOutput  = screen.queryByTestId("addUserModal");
    expect(modalOutput).toBeNull();
  });

  test("should open edit access modal edit click", async() => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
        <UserList />
        </GoogleOAuthProvider>
      </Provider>
    );
    fireEvent.click(await screen.getByTestId("edit-user-access-btn"));
    expect(screen.getByTestId("exit-edit-modal-btn")).toBeInTheDocument();
  });

  test("should close modal when cross exit click", async() => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
        <UserList />
        </GoogleOAuthProvider>
      </Provider>
    );
    fireEvent.click(await screen.getByTestId("edit-user-access-btn"));
    expect(screen.getByTestId("exit-edit-modal-btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("exit-edit-modal-btn"));
    expect(screen.queryByTestId("exit-edit-modal-btn")).toBeNull();
  });
});
