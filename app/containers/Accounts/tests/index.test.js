import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import UserProvider from 'contexts/UserProvider';
import { accountsMutationMock, accountsQueryMock } from './mock';
import Accounts from '..';

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

describe('<Accounts />', () => {
  afterEach(jest.resetModules);

  it('should render with data', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[accountsQueryMock.success]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Accounts />
        </UserProvider>
      </MockedProvider>
    );

    await waitFor(() => expect(getByText('user-0')).toBeVisible());
  });

  it('error message should be visible with error true', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[accountsQueryMock.error]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Accounts />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Failed to load Users.')).toBeVisible());
  });

  it('deleting account should be successful with valid query', async () => {
    const { getByText, getByRole, getAllByRole } = render(
      <MockedProvider
        mocks={[
          accountsQueryMock.success,
          accountsMutationMock.deleteAccountSuccess,
          accountsQueryMock.success,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Accounts />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('user-0')).toBeVisible());

    fireEvent.click(getAllByRole('button', { name: /delete/i })[0]);

    expect(getByRole('button', { name: 'Delete' }));
    fireEvent.click(getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(getByText('Account successfully deleted.')).toBeVisible());
  });

  it('deleting account should not be successful with invalid query', async () => {
    const { getByText, getByRole, getAllByRole } = render(
      <MockedProvider
        mocks={[accountsQueryMock.success, accountsMutationMock.deleteAccountError]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Accounts />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('user-0')).toBeVisible());

    fireEvent.click(getAllByRole('button', { name: /delete/i })[0]);

    expect(getByRole('button', { name: 'Delete' }));
    fireEvent.click(getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(getByText('Account could not be deleted.')).toBeVisible());
  });

  it('editing user should not be successful when query is invalid', async () => {
    const { getByText, getByLabelText, getByRole, getAllByRole } = render(
      <MockedProvider
        mocks={[accountsQueryMock.success, accountsMutationMock.editUserError]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Accounts />
        </UserProvider>
      </MockedProvider>
    );

    await waitFor(() => expect(getByText('user-0')).toBeVisible());

    fireEvent.click(getAllByRole('button', { name: /edit/i })[0]);
    expect(getByText('Edit Account')).toBeVisible();

    fireEvent.change(getByLabelText('E-mail'), { target: { value: 'test@test.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.click(getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(getByText('Account could not be updated.')).toBeVisible());
  });

  it('adding user should be successful when query is valid', async () => {
    const { getByText, getByLabelText, getAllByRole, getByRole } = render(
      <MockedProvider
        mocks={[
          accountsQueryMock.success,
          accountsQueryMock.success,
          accountsQueryMock.success,

          accountsMutationMock.addUserSuccess,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Accounts />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('user-0')).toBeVisible());
    fireEvent.click(getAllByRole('button', { name: /addaccount/i })[0]);
    expect(getByText('Add Account', { selector: 'div' })).toBeVisible();

    fireEvent.change(getByLabelText('E-mail'), { target: { value: 'test@test.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(getByText('Account successfully created.')).toBeVisible());
  });

  it('adding user should not be successful when query is invalid', async () => {
    const { getByText, getByLabelText, getByRole } = render(
      <MockedProvider
        mocks={[accountsQueryMock.success, accountsMutationMock.addUserError]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Accounts />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('user-0')).toBeVisible());

    fireEvent.click(getByRole('button', { name: /addaccount/i }));
    expect(getByText('Add Account', { selector: 'div' })).toBeVisible();

    fireEvent.change(getByLabelText('E-mail'), { target: { value: 'test@test.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(getByText('Account could not be created.')).toBeVisible());
  });

  it('fetchmore shoudl be called when onLoadMore button is clicked', async () => {
    const { getByRole, getByText } = render(
      <MockedProvider
        mocks={[accountsQueryMock.success, accountsQueryMock.fetchMore, accountsQueryMock.success]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Accounts />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('user-0')).toBeVisible());
    fireEvent.click(getByRole('button', { name: 'Load More' }));
    await waitFor(() => expect(getByText('user-18')).toBeVisible());
  });
  it('editing user should be successful when query is valid', async () => {
    const { getByText, getByLabelText, getByRole, getAllByRole } = render(
      <MockedProvider
        mocks={[
          accountsQueryMock.success,
          accountsQueryMock.success,
          accountsMutationMock.editUserSuccess,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Accounts />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('user-0')).toBeVisible());
    fireEvent.click(getAllByRole('button', { name: /edit/i })[0]);

    await waitFor(() => expect(getByText('Edit Account')).toBeVisible());

    fireEvent.change(getByLabelText('E-mail'), { target: { value: 'test@test.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(getByText('user-0')).toBeVisible());
    await waitFor(() => expect(getByText('Edit Account')).not.toBeVisible());
    await waitFor(() => expect(getByText('Account successfully updated.')).toBeVisible());
  }, 5000);
});
