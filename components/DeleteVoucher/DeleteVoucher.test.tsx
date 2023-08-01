import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../../store";
import "@testing-library/jest-dom";
import DeleteVoucher from "./DeleteVoucher";

const closeModal = jest.fn();
const refetch = jest.fn();
const selectedRows = {};

describe("Delete a Voucher tests", () => {
  test("Renders delete a voucher modal", async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <DeleteVoucher
            closeModal={closeModal}
            refetch={refetch}
            selectedVouchers={selectedRows}
          />
        </GoogleOAuthProvider>
      </Provider>
    );

    const deleteModal = screen.getByTestId("deleteVoucherModal");
    expect(deleteModal).toBeInTheDocument();
  });

  test("should close the modal on exit click", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <DeleteVoucher
            closeModal={closeModal}
            refetch={refetch}
            selectedVouchers={selectedRows}
          />
        </GoogleOAuthProvider>
      </Provider>
    );
    const exitButton = getByTestId("exitBtn");
    fireEvent.click(exitButton);
    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  test("should confirm the consent before deletion", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <DeleteVoucher
            closeModal={closeModal}
            refetch={refetch}
            selectedVouchers={selectedRows}
          />
        </GoogleOAuthProvider>
      </Provider>
    );
    const check: any = getByTestId("consentCheck").querySelector(
      'input[type="checkbox"]'
    );
    fireEvent.click(check);
    expect(check).toHaveProperty("checked", true);
  });
});
