import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../store/index";
import Index from "../pages/deals/index"

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

describe("SearchPage", () => {
    test("renders Search Page", () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <Index />
                </GoogleOAuthProvider>
            </Provider>
        );

        const data = getByTestId("dealsMainPage");
        expect(data).toBeTruthy();
    });
});
