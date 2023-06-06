import React from "react";
import { findByText, fireEvent, getByRole, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../../store/index";
import ManagePromotions from "./ManagePromotions";
import { useRouter } from "next/router";
import '@testing-library/jest-dom'

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

describe("Manage promotions unit tests", () => {
    test("renders Manage promotions", async () => {
        const { findByText } = render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <ManagePromotions />
                </GoogleOAuthProvider>
            </Provider>
        );
        await findByText("Manage Promotions")
    });

    test("go back button navigates to deals", async () => {
        const push = jest.fn();

        (useRouter as jest.Mock).mockImplementation(() => ({
          push,
        }));
        const { getByTestId } = render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <ManagePromotions />
                </GoogleOAuthProvider>
            </Provider>
        );
       fireEvent.click(getByTestId('back-btn'))
       expect(push).toHaveBeenCalledWith('/deals')
    });

    test("clicking on disable thowrs error for empty fields", async () => {
        const { getByTestId, findByText } = render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <ManagePromotions />
                </GoogleOAuthProvider>
            </Provider>
        );
       fireEvent.click(getByTestId('disable-btn'))
       await findByText('LOB is required')
       await findByText('Promotion Type is required')
       await findByText('Promotion ID is required')
    });

    test("opens confirmation modal after entering data", async () => {
        const { getByTestId, findByText, getAllByRole, getByRole, getByLabelText, queryByText } = render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <ManagePromotions />
                </GoogleOAuthProvider>
            </Provider>
        );
        const [ lob, promotionalType ] = getAllByRole('button', {
            name: 'Select Type'
        })
        fireEvent.mouseDown(lob)
        await waitFor(() => {
            fireEvent.click(getByRole('option', {
                name: 'Joe Fresh'
            }))
        })
        fireEvent.mouseDown(promotionalType)
        await waitFor(() => {
            fireEvent.click(getByRole('option', {
                name: 'Loyalty'
            }))
        })
        fireEvent.change(getByRole('textbox'), {
            target: {
                value: '123'
            }
        })
        fireEvent.click(getByTestId('disable-btn'))

        // Modal popus up
        await findByText('Are you sure?')
        expect(getByTestId('submitBtn')).toBeDisabled()

        // enables button after confirmation
        fireEvent.click(getByLabelText('Yes, I understand and would like to proceed.'))
        expect(getByTestId('submitBtn')).toBeEnabled()

        // closes modal
        fireEvent.click(getByTestId('exitBtn'))
        expect(await queryByText('Are you sure?')).not.toBeInTheDocument()
    });

    test("opens confirmation modal after entering data", async () => {
        const { getByTestId, findByText, getAllByRole, getByRole, getByLabelText, queryByText } = render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <ManagePromotions />
                </GoogleOAuthProvider>
            </Provider>
        );
        const [ lob, promotionalType ] = getAllByRole('button', {
            name: 'Select Type'
        })
        fireEvent.mouseDown(lob)
        await waitFor(() => {
            fireEvent.click(getByRole('option', {
                name: 'Joe Fresh'
            }))
        })
        fireEvent.mouseDown(promotionalType)
        await waitFor(() => {
            fireEvent.click(getByRole('option', {
                name: 'Loyalty'
            }))
        })
        fireEvent.change(getByRole('textbox'), {
            target: {
                value: '123'
            }
        })
        fireEvent.click(getByTestId('disable-btn'))
        await findByText('Are you sure?')
        fireEvent.click(getByLabelText('Yes, I understand and would like to proceed.'))
        fireEvent.click(getByTestId('submitBtn'))
        await waitFor(async () => expect(await queryByText('Are you sure?')).not.toBeInTheDocument())
    });
});
