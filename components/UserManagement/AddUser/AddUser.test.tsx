import React from "react";
import AddUser from "./AddUser";
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
  queryByAttribute,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../../../store";
import "@testing-library/jest-dom";

const closeModal = jest.fn();
const refetch = jest.fn();

describe("Add User Component", () => {
  test("should render the add user modal", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <AddUser closeModal={closeModal} refetch={refetch} />
        </GoogleOAuthProvider>
      </Provider>
    );
    const modal = getByTestId("addUserModal");
    expect(modal).toBeTruthy();
  });

  test("should render the entered email and email is valid", () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <AddUser closeModal={closeModal} refetch={refetch} />
        </GoogleOAuthProvider>
      </Provider>
    );
    const emailInput: any = screen.getByPlaceholderText("eg. johndoe@mail.com");
    fireEvent.change(emailInput, {
      target: {
        value: "test@test.com",
      },
    });
    expect(emailInput.value).toBe("test@test.com");
    fireEvent.blur(emailInput);
    const emailError = screen.queryByTestId("emailError");
    expect(emailError).toBeNull();
  });

  test("should render the entered email and email is not valid", () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <AddUser closeModal={closeModal} refetch={refetch} />
        </GoogleOAuthProvider>
      </Provider>
    );
    const emailInput: any = screen.getByPlaceholderText("eg. johndoe@mail.com");
    fireEvent.change(emailInput, {
      target: {
        value: "test@test",
      },
    });
    expect(emailInput.value).toBe("test@test");
    fireEvent.blur(emailInput);
    const emailError = screen.getByTestId("emailError");
    expect(emailError).toBeInTheDocument();
  });

  test("should set the selected role and role is valid", async () => {
    const getById = queryByAttribute.bind(null, "id");
    const dom = render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <AddUser closeModal={closeModal} refetch={refetch} />
        </GoogleOAuthProvider>
      </Provider>
    );
    const roleSelect: any = getById(dom.container, "role-select");
    fireEvent.mouseDown(roleSelect);
    fireEvent.click(screen.getByTestId("option"));
    await waitForElementToBeRemoved(screen.getByTestId("option"));
    expect(roleSelect).toHaveTextContent("Admin");
    fireEvent.blur(roleSelect);
    expect(screen.queryByTestId("roleError")).toBeNull();
  });

  test("should show error when no role is selected", async () => {
    const getById = queryByAttribute.bind(null, "id");
    const dom = render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <AddUser closeModal={closeModal} refetch={refetch} />
        </GoogleOAuthProvider>
      </Provider>
    );
    const button: any = getById(dom.container, "role-select");
    fireEvent.mouseDown(button);
    fireEvent.keyDown(screen.getByText("Admin"), {
      key: "Escape",
      code: "Escape",
    });
    await waitForElementToBeRemoved(screen.getByTestId("option"));
    expect(screen.getByTestId("selectLabel")).toBeInTheDocument();
    fireEvent.blur(button);
    expect(screen.getByTestId("roleError")).toBeInTheDocument();
  });

  test("should close the modal on click", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <AddUser closeModal={closeModal} refetch={refetch} />
        </GoogleOAuthProvider>
      </Provider>
    );
    const exitButton = getByTestId("exitBtn");
    fireEvent.click(exitButton);
    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  test("should add the user on submit", async () => {
    const getById = queryByAttribute.bind(null, "id");
    const dom = render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <AddUser closeModal={closeModal} refetch={refetch} />
        </GoogleOAuthProvider>
      </Provider>
    );

    //make email valid

    const emailInput: any = screen.getByPlaceholderText("eg. johndoe@mail.com");
    fireEvent.change(emailInput, {
      target: {
        value: "test@test.com",
      },
    });
    //make role valid

    expect(emailInput.value).toBe("test@test.com");
    const roleSelect: any = getById(dom.container, "role-select");
    fireEvent.mouseDown(roleSelect);
    fireEvent.click(screen.getByTestId("option"));
    await waitForElementToBeRemoved(screen.getByTestId("option"));
    expect(roleSelect).toHaveTextContent("Admin");

    //click on add

    const addButton = screen.getByTestId("addBtn");
    fireEvent.click(addButton);
    expect(closeModal).toHaveBeenCalled();
  });
});
