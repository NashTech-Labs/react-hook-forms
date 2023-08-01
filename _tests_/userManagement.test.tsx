import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../store/index";
import Index from "../pages/userManagement/index"

describe("User Mangement", () => {
    test("renders userManagement Page", () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <GoogleOAuthProvider clientId={""}>
                    <Index />
                </GoogleOAuthProvider>
            </Provider>
        );

        const data = getByTestId("userManagement");
        expect(data).toBeTruthy();
    });
});
