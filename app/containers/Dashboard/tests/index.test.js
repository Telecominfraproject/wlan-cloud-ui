import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { render, waitFor } from '@testing-library/react';
import UserProvider from 'contexts/UserProvider';
import { dashboardQueryMock } from './mock';
import Dashboard from '..';

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
jest.useFakeTimers();
describe('<Dashboard />', () => {
  afterEach(jest.resetModules);

  it('should render with data', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[
          dashboardQueryMock.filterSystemEvents.success,
          dashboardQueryMock.filterSystemEvents.success,
          dashboardQueryMock.getAllStatus.success,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Dashboard />
        </UserProvider>
      </MockedProvider>
    );
    jest.advanceTimersByTime('300000');
    await waitFor(() => expect(getByText('2.4GHz')).toBeVisible());
  });

  it('error message should be visible with error true', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[dashboardQueryMock.filterSystemEvents.error]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Dashboard />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Failed to load Dashboard')).toBeVisible());
  });
});
