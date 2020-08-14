import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import UserProvider from 'contexts/UserProvider';
import { editAccountMutationMock, editAccountQueryMock } from './mock';
import EditAccount from '..';

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

describe('<EditAccount />', () => {
  afterEach(jest.resetModules);

  it('should render with Data and Edit Profile when valid Mutation', async () => {
    const { getByText, getByTestId, getByLabelText } = render(
      <MockedProvider
        mocks={[editAccountQueryMock.success, editAccountMutationMock.success]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <EditAccount />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('New Password')).toBeVisible());

    fireEvent.change(getByLabelText('New Password'), { target: { value: 'password' } });
    await waitFor(() => expect(getByLabelText('New Password')).toHaveValue('password'));
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.submit(getByTestId('saveButton'));
    await waitFor(() => expect(getByText('Password successfully updated.')).toBeVisible());
  });

  it('should show error when query return Error', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[editAccountQueryMock.error]} addTypename={false}>
        <UserProvider {...mockProp}>
          <EditAccount />
        </UserProvider>
      </MockedProvider>
    );

    await waitFor(() => expect(getByText('Failed to load User.')).toBeVisible());
  });

  it('should show error when edit profile Mutation return error', async () => {
    const { getByText, getByTestId, getByLabelText } = render(
      <MockedProvider
        mocks={[editAccountQueryMock.success, editAccountMutationMock.error]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <EditAccount />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('New Password')).toBeVisible());

    fireEvent.change(getByLabelText('New Password'), { target: { value: 'password' } });
    await waitFor(() => expect(getByLabelText('New Password')).toHaveValue('password'));
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.submit(getByTestId('saveButton'));
    await waitFor(() => expect(getByText('Password could not be updated.')).toBeVisible());
  });
});
