import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../../store";
import "@testing-library/jest-dom";
import CreateDeal from "./CreateDeal";

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


describe("Create Deal tests", () => {
    test("should render all create deal details", async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <CreateDeal />
                </GoogleOAuthProvider>
            </Provider>
        );
        expect(screen.getByTestId("createDealTitle")).toBeInTheDocument();
    });

    test("Test Create Deal Discount button", async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <CreateDeal />
                </GoogleOAuthProvider>
            </Provider>
        );
        expect(screen.getByTestId("createDealTitle")).toBeInTheDocument();

        const clickIndicator = screen.getByTestId("discountdealBtn");
        fireEvent.click(clickIndicator);

        expect(screen.getByTestId("ContinueBtn")).toBeInTheDocument();
    });

    test("Test Create Deal Multi-buy button", async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <CreateDeal />
                </GoogleOAuthProvider>
            </Provider>
        );
        expect(screen.getByTestId("createDealTitle")).toBeInTheDocument();

        const clickIndicator = screen.getByTestId("multidealBtn");
        fireEvent.click(clickIndicator);

        expect(screen.getByTestId("ContinueBtn")).toBeInTheDocument();
    });

    test("Test Create Deal Free Shipping button", async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <CreateDeal />
                </GoogleOAuthProvider>
            </Provider>
        );
        expect(screen.getByTestId("createDealTitle")).toBeInTheDocument();

        const clickIndicator = screen.getByTestId("freeShippingdealBtn");
        fireEvent.click(clickIndicator);

        expect(screen.getByTestId("ContinueBtn")).toBeInTheDocument();
    });

    test("Test Cancel Deal button", async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <CreateDeal />
                </GoogleOAuthProvider>
            </Provider>
        );
        expect(screen.getByTestId("createDealTitle")).toBeInTheDocument();

        const clickIndicator = screen.getByTestId("CancelBtn");
        fireEvent.click(clickIndicator);

        expect(screen.getByTestId("CancelBtn")).toBeInTheDocument();
    });

    test("Test Continue Deal button", async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <CreateDeal />
                </GoogleOAuthProvider>
            </Provider>
        );
        expect(screen.getByTestId("createDealTitle")).toBeInTheDocument();

        const clickIndicator = screen.getByTestId("freeShippingdealBtn");
        fireEvent.click(clickIndicator);

        const clickContinueIndicator = screen.getByTestId("ContinueBtn");
        fireEvent.click(clickContinueIndicator);

        expect(screen.getByTestId("ContinueBtn")).toBeInTheDocument();
    });

});
