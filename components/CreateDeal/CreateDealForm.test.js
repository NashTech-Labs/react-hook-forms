import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../../store";
import "@testing-library/jest-dom";
import CreateDealForm from "./CreateDealForm";

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

describe("Create deal form tests", () => {
  beforeEach(()=>{
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <CreateDealForm/>
        </GoogleOAuthProvider>
      </Provider>
    );
  })
  test("Renders create form with out errors", async () => {
    expect(screen.getByTestId("form-title")).toBeInTheDocument();
  })

  test("Form is not submitted when required fields are not filled", async () => {
    fireEvent.click(screen.getByTestId('continue-btn'))
    await waitFor(() =>  expect(screen.getByText("Error: Title is required")).toBeInTheDocument())
  })

  describe("Title field tests", () => {
    test("Proper error messages are displayed for empty title field", async () => {
      fireEvent.change(screen.getByTestId('title'), { target: { value : '' }})
      fireEvent.focusOut(screen.getByTestId('title'))
      await waitFor(() =>  expect(screen.getByTestId("title-field-error")).toHaveTextContent('Error: Title is required'))
    })

    test("Proper error messages are displayed for title field with more than 80 characters", async () => {
      fireEvent.change(screen.getByTestId('title'), { target: { value : 'This is an example of a sample title name for more than 80 characters error unit test' }})
      fireEvent.focusOut(screen.getByTestId('title'))
      await waitFor(() =>  expect(screen.getByTestId("title-field-error")).toHaveTextContent('Error: Title should be less than 80 characters'))
    })

    test("No error messages are displayed for title field with less than 80 characters", async () => {
      fireEvent.change(screen.getByTestId('title'), { target: { value : 'This is an example of a sample title name for more than 80 characters test' }})
      fireEvent.focusOut(screen.getByTestId('title'))
      await waitFor(() =>  expect(screen.queryByTestId("title-field-error")).not.toBeInTheDocument())
    })
  })


  describe("Priority field tests", () => {
    test("Proper error messages are displayed for empty priority field", async () => {
      fireEvent.change(screen.getByTestId('priority'), { target: { value : '' }})
      fireEvent.focusOut(screen.getByTestId('priority'))
      await waitFor(() =>  expect(screen.getByTestId("priority-field-error")).toHaveTextContent('Error: Priority is required'))
    })

    test("Proper error messages are displayed for priority field with less than 1", async () => {
      fireEvent.change(screen.getByTestId('priority'), { target: { value : 0 }})
      fireEvent.focusOut(screen.getByTestId('priority'))
      await waitFor(() =>  expect(screen.getByTestId("priority-field-error")).toHaveTextContent('Error: Priority should be between 1 and 100'))
    })

    test("Proper error messages are displayed for priority field with more than 100", async () => {
      fireEvent.change(screen.getByTestId('priority'), { target: { value : 101 }})
      fireEvent.focusOut(screen.getByTestId('priority'))
      await waitFor(() =>  expect(screen.getByTestId("priority-field-error")).toHaveTextContent('Error: Priority should be between 1 and 100'))
    })

    test("No error messages are displayed for priority field ", async () => {
      fireEvent.change(screen.getByTestId('priority'), { target: { value : 50 }})
      fireEvent.focusOut(screen.getByTestId('priority'))
      await waitFor(() =>  expect(screen.queryByTestId("priority-field-error")).not.toBeInTheDocument())
    })
  })

  describe('Stacking type field tests', () => {
    test("Proper error messages are displayed for empty stacking type field", async () => {
      const [stackTypeSelect] = screen.getAllByText('Select Type')
      fireEvent.click(stackTypeSelect)
      fireEvent.focusOut(stackTypeSelect)
      await waitFor(() =>  expect(screen.getByTestId("stackingType-field-error")).toHaveTextContent('Error: Stacking type is required'))
    })

    test("No error messages are displayed for stacking type field", async () => {
      const [stackTypeSelect] = screen.getAllByText('Select Type')
      fireEvent.click(stackTypeSelect)
      fireEvent.change(screen.getByTestId('stackingType-input'), { target: { value: 'best_apply'}})
      await waitFor(() =>  expect(screen.queryByTestId("stackingType-field-error")).not.toBeInTheDocument())
    })
  })
});