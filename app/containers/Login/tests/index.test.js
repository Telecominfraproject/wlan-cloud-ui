import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, cleanup, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import UserProvider from 'contexts/UserProvider';
import { ThemeProvider } from '@tip-wlan/wlan-cloud-ui-library';
import { loginMutationMock } from './mock';
import Login from '..';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({ push: jest.fn() }),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const mockProp = {
  id: 123,
  email: 'test@test.com',
  role: 'admin',
  customerId: 2,
  updateUser: jest.fn(),
  updateToken: jest.fn(),
};

describe('<Login />', () => {
  afterEach(() => cleanup);
  it('login should be successful when mutation is valid', async () => {
    const { getByLabelText, getByTestId } = render(
      <ThemeProvider company="Test" logo="test.png" logoMobile="test.png">
        <MockedProvider mocks={[loginMutationMock.loginSuccess]} addTypename={false}>
          <UserProvider {...mockProp}>
            <Login />
          </UserProvider>
        </MockedProvider>
      </ThemeProvider>
    );

    fireEvent.change(getByLabelText('E-mail'), { target: { value: 'test@test.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.submit(getByTestId('loginButton'));
    await waitFor(() => expect(getByLabelText('E-mail')).toBeVisible());
  });

  it('login should not be successful when mutation is invalid', async () => {
    const { getByLabelText, getByText, getByTestId } = render(
      <ThemeProvider company="Test" logo="test.png" logoMobile="test.png">
        <MockedProvider mocks={[loginMutationMock.loginError]} addTypename={false}>
          <UserProvider {...mockProp}>
            <Login />
          </UserProvider>
        </MockedProvider>
      </ThemeProvider>
    );
    fireEvent.change(getByLabelText('E-mail'), { target: { value: 'test@test.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.submit(getByTestId('loginButton'));
    await waitFor(() => expect(getByText('Invalid e-mail or password.')).toBeVisible());
  });
});
