import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { render, waitFor } from '@testing-library/react';
import UserProvider from 'contexts/UserProvider';
import { APDetailsQueryMock } from './mock';
import AccessPointDetails from '..';

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
    id: '1',
  }),
  useHistory: () => ({ push: jest.fn() }),
}));

jest.useFakeTimers();
describe('<AccessPointDetails />', () => {
  afterEach(jest.resetModules);

  // it('should render with data', async () => {
  //   const { getByText } = render(
  //     <MockedProvider
  //       mocks={[
  //         APDetailsQueryMock.getEquipment.success,
  //         APDetailsQueryMock.getAllProfiles.success,
  //         APDetailsQueryMock.getAllFirmware.success,
  //         APDetailsQueryMock.filterServiceMetrics.success,
  //       ]}
  //       addTypename={false}
  //     >
  //       <UserProvider {...mockProp}>
  //         <AccessPointDetails locations={[1, 2, 3]} />
  //       </UserProvider>
  //     </MockedProvider>
  //   );
  //   jest.advanceTimersByTime('1000');
  // });

  it('error message should be visible with error true', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[
          APDetailsQueryMock.getEquipment.error,
          APDetailsQueryMock.getAllProfiles.error,
          APDetailsQueryMock.getAllFirmware.error,
          APDetailsQueryMock.filterServiceMetrics.error,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <AccessPointDetails locations={[1, 2, 3]} />
        </UserProvider>
      </MockedProvider>
    );
    jest.advanceTimersByTime('1000');
    await waitFor(() => expect(getByText('Failed to load Access Point data.')).toBeVisible());
  });

  it('error message should be visible with error true', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[
          APDetailsQueryMock.getEquipment.success,
          APDetailsQueryMock.getAllProfiles.error,
          APDetailsQueryMock.getAllFirmware.success,
          APDetailsQueryMock.filterServiceMetrics.success,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <AccessPointDetails locations={[1, 2, 3]} />
        </UserProvider>
      </MockedProvider>
    );
    jest.advanceTimersByTime('1000');
    await waitFor(() => expect(getByText('Failed to load Access Point profiles.')).toBeVisible());
  });

  it('error message should be visible with error true', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[
          APDetailsQueryMock.getEquipment.success,
          APDetailsQueryMock.getAllProfiles.success,
          APDetailsQueryMock.getAllFirmware.error,
          APDetailsQueryMock.filterServiceMetrics.success,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <AccessPointDetails locations={[1, 2, 3]} />
        </UserProvider>
      </MockedProvider>
    );
    jest.advanceTimersByTime('1000');
    await waitFor(() => expect(getByText('Failed to load Access Point firmware.')).toBeVisible());
  });

  // it('error message should be visible with error true', async () => {
  //   const { getByText } = render(
  //     <MockedProvider
  //       mocks={[
  //         APDetailsQueryMock.getEquipment.success,
  //         APDetailsQueryMock.getAllProfiles.success,
  //         APDetailsQueryMock.getAllProfiles.success,
  //         APDetailsQueryMock.getAllFirmware.success,
  //         APDetailsQueryMock.filterServiceMetrics.success,
  //         APDetailsQueryMock.getEquipment.success,
  //       ]}
  //       addTypename={false}
  //     >
  //       <UserProvider {...mockProp}>
  //         <AccessPointDetails locations={[1, 2, 3]} />
  //       </UserProvider>
  //     </MockedProvider>
  //   );
  //   jest.advanceTimersByTime(60000);
  // });
});
