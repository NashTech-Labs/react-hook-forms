import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { generateStore } from "../../store";
import "@testing-library/jest-dom";
import VoucherList from "./VoucherList";
import { useRouter } from "next/router";

const store = generateStore({
    user: {
        userProfile: {
            'name': "Test User"
        }
    }
});

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

describe("All Voucher tests", () => {
    test("Renders all voucher list", async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <VoucherList />
                </GoogleOAuthProvider>
            </Provider>
        );
        expect(screen.getByTestId("vouchers")).toBeInTheDocument();
    });

    test("Renders deal details with view button", async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <VoucherList />
                </GoogleOAuthProvider>
            </Provider>
        );
        await screen.findByText("PROMOTIONAL");
        await screen.findByTestId("view-btn");
    });

    test("Renders deal details with view button", async () => {

        const push = jest.fn();

        (useRouter as jest.Mock).mockImplementation(() => ({
            push,
        }));

        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <VoucherList />
                </GoogleOAuthProvider>
            </Provider>
        );
        const backBtn = screen.getByTestId("createVoucher");
        fireEvent.click(backBtn);
        expect(push).toHaveBeenCalledWith("/vouchers/create");
    });
});
