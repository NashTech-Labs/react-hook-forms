import React from "react";
import EditDealModal from "./EditDealModal";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../../store"
import '@testing-library/jest-dom'

describe("EditUserModal tests", () => {
    const closeModalMock = jest.fn()
    const refetchMock = jest.fn()

    test('Renders heading text on initial load', async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <EditDealModal closeModal={closeModalMock} isDealActive={true} disableDeal={jest.fn()} data={{}} dealId={''} refetch={refetchMock} />
                </GoogleOAuthProvider>
            </Provider>
        );
        await screen.getByTestId("heading")
    })

    test('Click on exit button', async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <EditDealModal closeModal={closeModalMock} isDealActive={true} disableDeal={jest.fn()} data={{}} dealId={''} refetch={refetchMock} />
                </GoogleOAuthProvider>
            </Provider>
        );
        const clickIndicator = await screen.getByTestId("exitBtn");
        fireEvent.click(clickIndicator);
    })

    test('Click on consentCheck and submit button', async () => {
        render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <EditDealModal closeModal={closeModalMock} isDealActive={true} disableDeal={jest.fn()} data={{}} dealId={''} refetch={refetchMock} />
                </GoogleOAuthProvider>
            </Provider>
        );
        const clickIndicator = await screen.getByTestId("consentCheck");
        fireEvent.click(clickIndicator);

        const clickSubmitIndicator = await screen.getByTestId("submitBtn");
        fireEvent.click(clickSubmitIndicator);
    })
})