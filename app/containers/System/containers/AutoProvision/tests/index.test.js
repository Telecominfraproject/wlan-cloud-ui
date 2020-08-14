import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter as Router } from 'react-router-dom';
import UserProvider from 'contexts/UserProvider';
import { autoProvisionMutationMock, autoProvisionQueryMock } from './mock';
import AutoProvision from '..';

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

describe('<AutoProvision />', () => {
  afterEach(jest.resetModules);

  it('should render with Data', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[
          autoProvisionQueryMock.getAllProfilesSuccess,
          autoProvisionQueryMock.getCustomerSuccess,
          autoProvisionQueryMock.getAllLocationsSuccess,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <AutoProvision />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('EA8300')).toBeVisible());
  });

  it('should show error when customer query return error', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[
          autoProvisionQueryMock.getAllProfilesSuccess,
          autoProvisionQueryMock.error,
          autoProvisionQueryMock.getAllLocationsSuccess,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <AutoProvision />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Failed to load Customer Data.')).toBeVisible());
  });

  it('should render with Data and update successfully', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider
        mocks={[
          autoProvisionQueryMock.getAllProfilesSuccess,
          autoProvisionQueryMock.getCustomerSuccess,
          autoProvisionQueryMock.getCustomerSuccess,
          autoProvisionQueryMock.getAllLocationsSuccess,
          autoProvisionMutationMock.success,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <AutoProvision />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('EA8300')).toBeVisible());
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(getByText('Settings successfully updated.')).toBeVisible());
    await waitFor(() => expect(getByText('EA8300')).toBeVisible());
  });

  it('should render with Data and update show error when mutation return error', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider
        mocks={[
          autoProvisionQueryMock.getAllProfilesSuccess,
          autoProvisionQueryMock.getCustomerSuccess,
          autoProvisionQueryMock.getCustomerSuccess,
          autoProvisionQueryMock.getAllLocationsSuccess,
          autoProvisionMutationMock.error,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <AutoProvision />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('EA8300')).toBeVisible());
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(getByText('Settings could not be updated.')).toBeVisible());
  });
});
