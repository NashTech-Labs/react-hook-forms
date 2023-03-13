import React from "react";
import { notifyError, notifySuccess } from "./Notification";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../../store";
import { ToastContainer } from "react-toastify";

describe("Notification", () => {
  test("Success Toast", async() => {
    render(
        <Provider store={store}>
          <GoogleOAuthProvider clientId={""}>
            <ToastContainer/>
          </GoogleOAuthProvider>
        </Provider>
      );
    notifySuccess("Success");
    expect(await screen.findByText("Success")).toBeInTheDocument();
  });

  test("Error Toast", async() => {
    render(
        <Provider store={store}>
          <GoogleOAuthProvider clientId={""}>
            <ToastContainer/>
          </GoogleOAuthProvider>
        </Provider>
      );
    notifyError("Error","test-error")
    expect(await screen.findByText("Error")).toBeInTheDocument();
  });
});