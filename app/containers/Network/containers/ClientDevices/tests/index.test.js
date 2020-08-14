import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import UserProvider from 'contexts/UserProvider';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClientDevicesQueryMock } from './mock';
import ClientDevices from '..';

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

describe('<ClientDevices />', () => {
  afterEach(jest.resetModules);

  it('should render with data', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[ClientDevicesQueryMock.filterClientSessions.success]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <ClientDevices checkedLocations={['2', '3', '4', '5', '6', '7', '8']} />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('74:9c:00:01:45:ae')).toBeVisible());
    await waitFor(() => expect(getByText('hostName-128213363803566')).toBeVisible());
  });

  it('error message should be visible with error true', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[ClientDevicesQueryMock.filterClientSessions.error]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <ClientDevices checkedLocations={[1, 2, 3]} />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Failed to load client devices.')).toBeVisible());
  });

  it('click on Load More should fetch more data', async () => {
    const { getByRole, getByText, getAllByText } = render(
      <MockedProvider
        mocks={[
          ClientDevicesQueryMock.filterClientSessions.success,
          ClientDevicesQueryMock.filterClientSessions.loadmore,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <ClientDevices checkedLocations={['2', '3', '4', '5', '6', '7', '8']} />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('74:9c:00:01:45:ae')).toBeVisible());
    await waitFor(() => expect(getByText('hostName-128213363803566')).toBeVisible());
    fireEvent.click(getByRole('button', { name: /load more/i }));
    await waitFor(() => expect(getByText('74:9c:00:01:45:ae')).toBeVisible());
    await waitFor(() => expect(getAllByText('hostName-128213363803566')[1]).toBeVisible());
  });

  it('click on reload button should refetch data', async () => {
    const { getByText, container } = render(
      <MockedProvider
        mocks={[
          ClientDevicesQueryMock.filterClientSessions.success,
          ClientDevicesQueryMock.filterClientSessions.success,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <ClientDevices checkedLocations={['2', '3', '4', '5', '6', '7', '8']} />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('74:9c:00:01:45:ae')).toBeVisible());
    await waitFor(() => expect(getByText('hostName-128213363803566')).toBeVisible());
    const reloadButton = container.querySelector(
      '.ant-btn.index-module__Button___VGygY.ant-btn-icon-only'
    );
    fireEvent.click(reloadButton);
    await waitFor(() => expect(getByText('Client devices reloaded.')).toBeVisible());
  });

  it('click on reload button should not refetch data when query return error', async () => {
    const { getByText, container } = render(
      <MockedProvider
        mocks={[ClientDevicesQueryMock.filterClientSessions.success]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <ClientDevices checkedLocations={['2', '3', '4', '5', '6', '7', '8']} />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('74:9c:00:01:45:ae')).toBeVisible());
    await waitFor(() => expect(getByText('hostName-128213363803566')).toBeVisible());
    const reloadButton = container.querySelector(
      '.ant-btn.index-module__Button___VGygY.ant-btn-icon-only'
    );
    fireEvent.click(reloadButton);
    await waitFor(() => expect(getByText('Client devices could not be reloaded.')).toBeVisible());
  });
});
