import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter as Router } from 'react-router-dom';
import UserProvider from 'contexts/UserProvider';
import { firmwareMutationMock, firmwareQueryMock } from './mock';
import Firmware from '..';

const {
  getAllFirmwareModelsSuccess,
  getAllFirmwareSuccess,
  getFirmwareTrackAssignmentSuccess,
  getFirmwareTrackSuccess,
} = firmwareQueryMock;

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

describe('<Firmware />', () => {
  afterEach(jest.resetModules);

  it('should render with Data', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[
          getAllFirmwareModelsSuccess,
          getAllFirmwareSuccess,
          getFirmwareTrackAssignmentSuccess,
          getFirmwareTrackSuccess,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <Firmware />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('ap2220-2020-06-25-ce03472')).toBeVisible());
  });

  it('should render with Data and Edit Model Target successfully', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider
        mocks={[
          getAllFirmwareModelsSuccess,
          getAllFirmwareSuccess,
          getFirmwareTrackAssignmentSuccess,
          getFirmwareTrackAssignmentSuccess,
          getFirmwareTrackSuccess,
          firmwareMutationMock.updateTrackAssignmentSuccess,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <Firmware />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('ap2220-2020-06-25-ce03472')).toBeVisible());
    fireEvent.click(getByRole('button', { name: `edit-track-ap2220` }));
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(getByText('Model Target Version successfully updated.')).toBeVisible()
    );
  });

  it('should render with Data and Edit Model Target show error when mutation not work ', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider
        mocks={[
          getAllFirmwareModelsSuccess,
          getAllFirmwareSuccess,
          getFirmwareTrackAssignmentSuccess,
          getFirmwareTrackAssignmentSuccess,
          getFirmwareTrackSuccess,
          firmwareMutationMock.updateTrackAssignmentError,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <Firmware />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('ap2220-2020-06-25-ce03472')).toBeVisible());
    fireEvent.click(getByRole('button', { name: `edit-track-ap2220` }));
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(getByText('Model Target Version could not be updated.')).toBeVisible()
    );
  });
});
