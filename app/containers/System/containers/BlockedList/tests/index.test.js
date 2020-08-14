import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter as Router } from 'react-router-dom';
import UserProvider from 'contexts/UserProvider';
import { blockListMutationMock, blockListQueryMock } from './mock';
import BlockedList from '..';

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

describe('<BlockedList />', () => {
  afterEach(jest.resetModules);

  it('should render with Data', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[blockListQueryMock.success]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Router>
            <BlockedList />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('74:9c:00:01:45:ae')).toBeVisible());
  });

  it('should show error when Block query return error', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[blockListQueryMock.error]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Router>
            <BlockedList />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Failed to load Client Data.')).toBeVisible());
  });

  it('should render with Data and add Client successfully', async () => {
    const { getByText, getByLabelText, getByRole } = render(
      <MockedProvider
        mocks={[
          blockListQueryMock.success,
          blockListQueryMock.success,
          blockListMutationMock.addClientSuccess,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <BlockedList />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('74:9c:00:01:45:ae')).toBeVisible());
    fireEvent.click(getByRole('button', { name: 'Add Client' }));
    fireEvent.change(getByLabelText('MAC Address'), { target: { value: '74:8c:00:01:45:ae' } });
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(getByText('Client successfully added to Blocked List')).toBeVisible()
    );
  });

  it('should render with Data and add Client return error when mutation not work', async () => {
    const { getByText, getByLabelText, getByRole } = render(
      <MockedProvider
        mocks={[blockListQueryMock.success, blockListMutationMock.addClientError]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <BlockedList />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('74:9c:00:01:45:ae')).toBeVisible());
    fireEvent.click(getByRole('button', { name: 'Add Client' }));
    fireEvent.change(getByLabelText('MAC Address'), { target: { value: '74:8c:00:01:45:ae' } });
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(getByText('Client could not be added to Blocked List')).toBeVisible()
    );
  });

  it('should render with Data and update Client successfully', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider
        mocks={[
          blockListQueryMock.success,
          blockListQueryMock.success,
          blockListMutationMock.updateClientSuccess,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <BlockedList />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('74:9c:00:01:45:ae')).toBeVisible());
    fireEvent.click(
      getByRole('button', {
        name: `delete-mac-74:9c:00:01:45:ae`,
      })
    );
    fireEvent.click(getByRole('button', { name: 'Remove' }));
    await waitFor(() =>
      expect(getByText('Client successfully removed from Blocked List')).toBeVisible()
    );
  });

  it('should render with Data and update Client return error when mutation not work', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider
        mocks={[
          blockListQueryMock.success,
          blockListQueryMock.success,
          blockListMutationMock.updateClientError,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <BlockedList />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('74:9c:00:01:45:ae')).toBeVisible());
    fireEvent.click(
      getByRole('button', {
        name: `delete-mac-74:9c:00:01:45:ae`,
      })
    );
    fireEvent.click(getByRole('button', { name: 'Remove' }));
    await waitFor(() =>
      expect(getByText('Client could not be removed from Blocked List')).toBeVisible()
    );
  });
});
