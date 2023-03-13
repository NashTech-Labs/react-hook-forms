import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../../store/index";
import { SearchEmptyError, SearchError } from "./SearchError";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

describe("Search Error Component", () => {
    test("renders Empty Search Error", () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <SearchEmptyError />
                </GoogleOAuthProvider>
            </Provider>
        );

        const data = getByTestId("emptySearch");
        expect(data).toBeTruthy();
    });

    test("should reload on click", () => {
        Object.defineProperty(window, "location", {
            configurable: true,
            value: { reload: jest.fn() },
        });
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <SearchEmptyError />
                </GoogleOAuthProvider>
            </Provider>
        );

        const refreshBtn = screen.getByText("Refresh this page");
        fireEvent.click(refreshBtn);
        expect(window.location.reload).toHaveBeenCalled();
    });

    test("renders Search Error", () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <SearchError />
                </GoogleOAuthProvider>
            </Provider>
        );

        const data = getByTestId("searchError");
        expect(data).toBeTruthy();
    });

    test("should reload on click", () => {
        Object.defineProperty(window, "location", {
            configurable: true,
            value: { reload: jest.fn() },
        });
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <SearchError />
                </GoogleOAuthProvider>
            </Provider>
        );

        const refreshBtn = screen.getByText("Refresh this page");
        fireEvent.click(refreshBtn);
        expect(window.location.reload).toHaveBeenCalled();
    });
});
