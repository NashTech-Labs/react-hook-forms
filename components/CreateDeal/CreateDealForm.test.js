import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { generateStore } from "../../store";
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

const store = generateStore({
    deal: {
        dealLevelName: 'product',
    },
});

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

  //Promotional Message Tests

  describe("Promotional Message Tests", () => {
    test("Proper error messages are displayed for empty english message field", async () => {
      fireEvent.change(screen.getByTestId('englishMessage'), { target: { value : '' }})
      fireEvent.focusOut(screen.getByTestId('englishMessage'))
      await waitFor(() =>  expect(screen.getByTestId("englishMessage-field-error")).toHaveTextContent('Error: English message required'))
    })

    test("No error messages are displayed for english message field when message is there", async () => {
      fireEvent.change(screen.getByTestId('englishMessage'), { target: { value : 'Sample English Message' }})
      fireEvent.focusOut(screen.getByTestId('englishMessage'))
      await waitFor(() =>  expect(screen.queryByTestId("englishMessage-field-error")).not.toBeInTheDocument())
    })

    test("Proper error messages are displayed for empty French message field", async () => {
      fireEvent.change(screen.getByTestId('frenchMessage'), { target: { value : '' }})
      fireEvent.focusOut(screen.getByTestId('frenchMessage'))
      await waitFor(() =>  expect(screen.getByTestId("frenchMessage-field-error")).toHaveTextContent('Error: French message required'))
    })

    test("No error messages are displayed for French message field when message is there", async () => {
      fireEvent.change(screen.getByTestId('frenchMessage'), { target: { value : 'Sample English Message' }})
      fireEvent.focusOut(screen.getByTestId('frenchMessage'))
      await waitFor(() =>  expect(screen.queryByTestId("frenchMessage-field-error")).not.toBeInTheDocument())
    })

    test("should reset the english Message field on reset to default button click", () => {
      fireEvent.click(screen.getByTestId('englishMsgReset'))
      expect(screen.getByTestId("englishMessage").value).toBe('')
    })

    test("should reset the french Message field on reset to default button click", () => {
      fireEvent.click(screen.getByTestId('frenchMsgReset'))
      expect(screen.getByTestId("frenchMessage").value).toBe('')
    })
  })

  // Date-In-Effect Test cases

  describe('Date-In-Effect field tests', () => {
    test("Proper error messages are displayed for empty start date field", async () => {
      fireEvent.click(screen.getByTestId('startDatePicker-icon'))
      fireEvent.change(screen.getByTestId('startDatePicker'), { target: { value : '' }})
      fireEvent.focusOut(screen.getByTestId('startDatePicker'))
      await waitFor(() =>  expect(screen.getByTestId("startDatePicker-field-error")).toHaveTextContent('Error: Date required'))
    })

    test("Proper error messages are displayed for empty start time field", async () => {
      fireEvent.click(screen.getByTestId('startTimePicker-icon'))
      fireEvent.change(screen.getByTestId('startTimePicker'), { target: { value : '' }})
      fireEvent.focusOut(screen.getByTestId('startTimePicker'))
      await waitFor(() =>  expect(screen.getByTestId("startTimePicker-field-error")).toHaveTextContent('Error: Time required'))
    })

    test("Proper error messages are displayed for empty end date field", async () => {
      fireEvent.click(screen.getByTestId('endDatePicker-icon'))
      fireEvent.change(screen.getByTestId('endDatePicker'), { target: { value : '' }})
      fireEvent.focusOut(screen.getByTestId('endDatePicker'))
      await waitFor(() =>  expect(screen.getByTestId("endDatePicker-field-error")).toHaveTextContent('Error: Date required'))
    })

    test("Proper error messages are displayed for empty end time field", async () => {
      fireEvent.click(screen.getByTestId('endTimePicker-icon'))
      fireEvent.change(screen.getByTestId('endTimePicker'), { target: { value : '' }})
      fireEvent.focusOut(screen.getByTestId('endTimePicker'))
      await waitFor(() =>  expect(screen.getByTestId("endTimePicker-field-error")).toHaveTextContent('Error: Time required'))
    })
  })

  // Upload Component Test Cases

  test("Renders create collection title", async () => {
    expect(screen.getByTestId("collection")).toBeInTheDocument();
  })

  describe('Upload field tests', () => {
    test("Upload input file with input fields", async () => {
      fireEvent.click(screen.getByTestId('uploadCollection'))
      fireEvent.change(screen.getByTestId('uploadCollection'), { target: { files: {name: "LIAMs.xlsx", lastModifiedDate: "2023-02-15T12:22:53.169Z", webkitRelativePath: "", size: 9300, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"} } } )
      await waitFor(() =>  expect(screen.getByTestId("file-field-error")).toHaveTextContent('Error: FIle required'))
    })
  })

});