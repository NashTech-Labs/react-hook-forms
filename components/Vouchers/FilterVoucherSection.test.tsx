import React from 'react'
import FilterVoucherSection from './FilterVoucherSection'
import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { generateStore } from "../../store";
import "@testing-library/jest-dom";

const storePayload = {
    user: {
        token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVkZjFmOTQ1ZmY5MDZhZWFlZmE5M2MyNzY5OGRiNDA2ZDYwNmIwZTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2Nzg3MDk1ODgsImF1ZCI6Ijg5NDkzMjIxOTg0MS05ZXAxM2d0OTFoajNqbjVtMHNvZmNsM2doMDVkZ2J0Zy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMjk5NDIxOTA1MDUyODg2NDg1MSIsImhkIjoibG9ibGF3LmNhIiwiZW1haWwiOiJwdXNocGVuZHJhLnNoYXJtYUBsb2JsYXcuY2EiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiODk0OTMyMjE5ODQxLTllcDEzZ3Q5MWhqM2puNW0wc29mY2wzZ2gwNWRnYnRnLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibmFtZSI6IlB1c2hwZW5kcmEgU2hhcm1hIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FHTm15eFp6eloxbGNBYkh3YjY2U19iel9TU0c0TUQ3V2RGZEVHM1hFdTZSPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlB1c2hwZW5kcmEiLCJmYW1pbHlfbmFtZSI6IlNoYXJtYSIsImlhdCI6MTY3ODcwOTg4OCwiZXhwIjoxNjc4NzEzNDg4LCJqdGkiOiIwYjQxNThlNmEwMGJkNTZiODdhNmJhMjQzYmFiMmQxNzA1Yzc2NTI5In0.Wa50n1y5YlsM_XVfRq0F-eaKewjvaXuhJKf_Xd1FErRh8oF11dZdEgwFK34UaCgD-gXymdBpYQ7k5UdTv8fzi8xeX8_liIfM-U24HsSJHHynym1cV8OC2pO2hdTuKLqHqjXwW9sHj0mkaiqxvP53sytXG_TEo2XcfsHv4RbYymYKhyJspBIBZwKiH2RKBCefyjvI_te56cW2lVkWdLC5U1dF-dBVB7rx7UDKv_QJk0llQGIGov-1Uw5sPD812KFqALhmnfVmdM6C-xgSkai-q5cJZBRJ0rGX6sR8Mwn4LTEaT-q7JLOmDDRt6R0TJTv8PwgoTJWAOwF2pCvpRkBAiA",
        role: ["CS_ADMIN", "BO_ADMIN"]
    },
};

describe('Filter section unit tests', () => {
    afterEach(cleanup)
    test('Opens modal when clicked on filter', async () => {
        render(
            <Provider store={generateStore(storePayload)}>
                <GoogleOAuthProvider clientId={""}>
                    <FilterVoucherSection />
                </GoogleOAuthProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTestId('filter-button'))
        await waitFor(async () => {
            expect(screen.getByTestId('exit-btn')).toBeInTheDocument()
        })
    })
    test('Closes modal when clicked on exit', async () => {
        render(
            <Provider store={generateStore(storePayload)}>
                <GoogleOAuthProvider clientId={""}>
                    <FilterVoucherSection />
                </GoogleOAuthProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTestId('filter-button'))
        await waitFor(async () => {
            expect(screen.getByTestId('exit-btn')).toBeInTheDocument()
            fireEvent.click(screen.getByTestId('exit-btn'))
            expect(screen.queryByTestId('exit-btn')).not.toBeInTheDocument()
        })
    })
    test('Closes modal when clicked on exit', async () => {
        render(
            <Provider store={generateStore(storePayload)}>
                <GoogleOAuthProvider clientId={""}>
                    <FilterVoucherSection />
                </GoogleOAuthProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTestId('filter-button'))
        await waitFor(async () => {
            expect(screen.getByTestId('exit-btn')).toBeInTheDocument()
            fireEvent.click(screen.getByTestId('close-icon'))
            expect(screen.queryByTestId('exit-btn')).not.toBeInTheDocument()
        })
    })
    test('Date fileds are disabled', async () => {
        render(
            <Provider store={generateStore(storePayload)}>
                <GoogleOAuthProvider clientId={""}>
                    <FilterVoucherSection />
                </GoogleOAuthProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTestId('filter-button'))
        await waitFor(async () => {
            expect(screen.getByTestId('startDate')).toBeDisabled()
            expect(screen.getByTestId('endDate')).toBeDisabled()
        })
    })
    test('Date fileds are enabled when clicked on checkbox', async () => {
        render(
            <Provider store={generateStore(storePayload)}>
                <GoogleOAuthProvider clientId={""}>
                    <FilterVoucherSection />
                </GoogleOAuthProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTestId('filter-button'))
        await waitFor(() => {
            expect(screen.getByTestId('startDate')).toBeDisabled()
            expect(screen.getByTestId('endDate')).toBeDisabled()
        })
        fireEvent.click(screen.getByTestId('start-date-checkbox'))
        fireEvent.click(screen.getByTestId('end-date-checkbox'))
        await waitFor(() => {
            expect(screen.getByTestId('startDate')).toBeEnabled()
            expect(screen.getByTestId('endDate')).toBeEnabled()
        })
    })
    test('Updates count on filter button label', async () => {
        render(
            <Provider store={generateStore(storePayload)}>
                <GoogleOAuthProvider clientId={""}>
                    <FilterVoucherSection />
                </GoogleOAuthProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTestId('filter-button'))
        await waitFor(async () => {
            expect(screen.getByTestId('exit-btn')).toBeInTheDocument()
        })
        fireEvent.click(screen.getByTestId('ACTIVE'))
        fireEvent.click(screen.getByTestId('update-btn'))
        await waitFor(() => {
            expect(screen.getByTestId('filter-button')).toHaveTextContent('1 Applied')
        })
    })

    test('clears filters porperly', async () => {
        render(
            <Provider store={generateStore(storePayload)}>
                <GoogleOAuthProvider clientId={""}>
                    <FilterVoucherSection />
                </GoogleOAuthProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTestId('filter-button'))
        await waitFor(async () => {
            expect(screen.getByTestId('exit-btn')).toBeInTheDocument()
        })
        screen.debug(undefined, Infinity)
        fireEvent.click(screen.getByTestId('ACTIVE'))
        fireEvent.click(screen.getByTestId('update-btn'))
        await waitFor(async () => {
            await expect(screen.getByTestId('filter-button')).toHaveTextContent('1 Applied')
        })
        fireEvent.click(screen.getByTestId('filter-button'))
        await waitFor(async () => {
            expect(screen.getByTestId('exit-btn')).toBeInTheDocument()
        })
        fireEvent.click(screen.getByTestId('clear-btn'))
        fireEvent.click(screen.getByTestId('update-btn'))
        await waitFor(() => {
            expect(screen.getByTestId('filter-button')).toHaveTextContent('0 Applied')
        })
    })
})