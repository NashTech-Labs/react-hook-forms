import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { generateStore } from "../../store";
import "@testing-library/jest-dom";
import Summary from "./Summary";

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
        dealId: 657,
    },
});

describe("Summary Page Test", () => {
    test("should render all summary Page details", async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <Summary />
                </GoogleOAuthProvider>
            </Provider>
        );

        await expect(screen.getByTestId("title")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByTestId("collection")).toBeInTheDocument()
        })
    });


    test("back button clicked", async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <Summary />
                </GoogleOAuthProvider>
            </Provider>
        );

        const backBtn = screen.getByTestId("back");
        fireEvent.click(backBtn);
    });

    test("download button of Scope Data", async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <Summary />
                </GoogleOAuthProvider>
            </Provider>
        );

        const clickIndicator = await screen.getByTestId("btn");
        fireEvent.click(clickIndicator);
    });

    test("download button of Exclusion Data", async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <Summary />
                </GoogleOAuthProvider>
            </Provider>
        );

        const clickIndicator = await screen.getByTestId("exbtn");
        fireEvent.click(clickIndicator);
    });

});
