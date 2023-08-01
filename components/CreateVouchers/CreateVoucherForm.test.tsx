import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../../store";
import "@testing-library/jest-dom";
import CreateVoucherForm from "./CreateVoucherForm";

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

describe("Create Voucher form tests", () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <CreateVoucherForm />
                </GoogleOAuthProvider>
            </Provider>
        );
    })
    test("Renders create form with out errors", async () => {
        await screen.findByText("Description");
    })
});