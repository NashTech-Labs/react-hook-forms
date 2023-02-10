import React from "react";
import EditUserModal from "./EditUserModal";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../../../store"
import '@testing-library/jest-dom'

describe("EditUserModal tests", () => {
  const closeModalMock = jest.fn()
  const refetchMock = jest.fn()

  test('Renders two buttons on initial load', async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <EditUserModal closeModal={closeModalMock} user={{}} handleRemoveUser={jest.fn()} selectedRow={{}} refetch ={refetchMock} />
        </GoogleOAuthProvider>
      </Provider>
    );
    await screen.findByText('Update Role')
    await screen.findByText('Remove User')
  })

  test('Calls close Modal when clicked on Exit', async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <EditUserModal closeModal={closeModalMock} user={{}} handleRemoveUser={jest.fn()} selectedRow={{}} refetch ={refetchMock} />
        </GoogleOAuthProvider>
      </Provider>
    );
    fireEvent.click(await screen.findByText('Exit'))
    expect(closeModalMock).toHaveBeenCalled()
  })

  test('Clicking on Update user goes to update content', async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <EditUserModal closeModal={closeModalMock} user={{}} handleRemoveUser={jest.fn()} selectedRow={{}} refetch ={refetchMock} />
        </GoogleOAuthProvider>
      </Provider>
    );
    fireEvent.click(await screen.findByText('Update Role'))
    await screen.findByText('User')
    await screen.findByText('Administrator')
  })

  test('Clicking on Submit throws error when nothing is selected', async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <EditUserModal closeModal={closeModalMock} user={{}} handleRemoveUser={jest.fn()} selectedRow={{}} refetch ={refetchMock} />
        </GoogleOAuthProvider>
      </Provider>
    );
    fireEvent.click(await screen.findByText('Update Role'))
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    fireEvent.click(await screen.findByText('Submit'))
    expect(screen.getByTestId('error')).toBeInTheDocument()
  })

  test('Clicking on Submit throws no error when permission is selected', async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <EditUserModal closeModal={closeModalMock} user={{}} handleRemoveUser={jest.fn()} selectedRow={{}} refetch ={refetchMock} />
        </GoogleOAuthProvider>
      </Provider>
    );
    fireEvent.click(await screen.findByText('Update Role'))
    fireEvent.click(await screen.getByTestId("agent-checkbox"))
    expect(await screen.getByTestId("agent-checkbox")).toBeChecked()
    fireEvent.click(await screen.findByText('Submit'))
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })

  test('Clicking on exit closes modal in update content', async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <EditUserModal closeModal={closeModalMock} user={{}} handleRemoveUser={jest.fn()} selectedRow={{}} refetch ={refetchMock} />
        </GoogleOAuthProvider>
      </Provider>
    );
    fireEvent.click(await screen.findByText('Update Role'))
    fireEvent.click(await screen.findByText('Exit'))
    expect(closeModalMock).toHaveBeenCalled()
  })

  test('Clicking on Remove user goes to Remove user content', async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <EditUserModal closeModal={closeModalMock} user={{}} handleRemoveUser={jest.fn()} selectedRow={{}} refetch ={refetchMock} />
        </GoogleOAuthProvider>
      </Provider>
    );
    fireEvent.click(await screen.findByText('Remove User'))
    await screen.findByText('Yes, I understand and would like to proceed.')
    expect(await screen.findByTestId('confirm-removel-btn')).toBeDisabled()
  })

  test('Clicking on Exit removes Modal', async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <EditUserModal closeModal={closeModalMock} user={{}} handleRemoveUser={jest.fn()} selectedRow={{}} refetch ={refetchMock} />
        </GoogleOAuthProvider>
      </Provider>
    );
    fireEvent.click(await screen.findByText('Remove User'))
    fireEvent.click(await screen.findByTestId('exit-btn'))
    expect(closeModalMock).toHaveBeenCalled()
  })

  test('Clicking on consent enables the button', async () => {
    render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={""}>
          <EditUserModal closeModal={closeModalMock} user={{}} handleRemoveUser={jest.fn()} selectedRow={{}} refetch ={refetchMock} />
        </GoogleOAuthProvider>
      </Provider>
    );
    fireEvent.click(await screen.findByText('Remove User'))
    fireEvent.click(await screen.findByTestId('consent'))
    expect(await screen.findByTestId('confirm-removel-btn')).toBeEnabled()
  })
})