import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, waitFor, cleanup } from '@testing-library/react';
import UserProvider from 'contexts/UserProvider';
import { ClientDevicesDetailsQueryMock } from './mock';
import ClientDeviceDetails from '..';

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

jest.mock('moment', () => () => ({
  subtract: () => ({ valueOf: () => ({ toString: () => '1234' }) }),
  valueOf: () => ({ toString: () => '1234' }),
}));
jest.mock('react-router-dom', () => ({
  useParams: () => ({
    id: '74:9c:00:01:45:ae',
  }),
  useHistory: () => ({ push: jest.fn() }),
}));

jest.useFakeTimers();
describe('<ClientDeviceDetails />', () => {
  afterEach(cleanup);
  beforeEach(() => jest.useFakeTimers());
  it('error message should be visible with error true', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[ClientDevicesDetailsQueryMock.getClientSession.error]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <ClientDeviceDetails />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Failed to load Client Device.')).toBeVisible());
  });

  it('should render with data', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[
          ClientDevicesDetailsQueryMock.getClientSession.success,
          ClientDevicesDetailsQueryMock.filterServiceMetrics.success,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <ClientDeviceDetails />
        </UserProvider>
      </MockedProvider>
    );
    // jest.advanceTimersByTime('1000');
    await waitFor(() => expect(getByText('74:9c:00:01:45:ae')).toBeVisible());
  });

  it.only('click on reload button should refetch data', async () => {
    const { getByText, container } = render(
      <MockedProvider
        mocks={[
          ClientDevicesDetailsQueryMock.getClientSession.success,
          ClientDevicesDetailsQueryMock.filterServiceMetrics.success,
          ClientDevicesDetailsQueryMock.getClientSession.success,
          ClientDevicesDetailsQueryMock.filterServiceMetrics.success,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <ClientDeviceDetails />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('74:9c:00:01:45:ae')).toBeVisible());
    // await waitFor(() => expect(getByText('hostName-128213363803566')).toBeVisible());
    const reloadButton = container.querySelector(
      '.ant-btn.index-module__Button___VGygY.ant-btn-icon-only'
    );
    fireEvent.click(reloadButton);
    await waitFor(() => expect(getByText('Successfully reloaded.')).toBeVisible());
  });

  // it('error message should be visible with error true', async () => {
  //   const { getByText } = render(
  //     <MockedProvider
  //       mocks={[
  //         ClientDevicesDetailsQueryMock.getClientSession.success,
  //         ClientDevicesDetailsQueryMock.filterServiceMetrics.success,
  //         ClientDevicesDetailsQueryMock.filterServiceMetrics.success,
  //         ClientDevicesDetailsQueryMock.getClientSession.success,
  //       ]}
  //       addTypename={false}
  //     >
  //       <UserProvider {...mockProp}>
  //         <ClientDeviceDetails  />
  //       </UserProvider>
  //     </MockedProvider>
  //   );
  //   jest.advanceTimersByTime(60000);
  // });
});
