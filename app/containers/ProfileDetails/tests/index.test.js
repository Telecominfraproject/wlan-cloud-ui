import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import UserProvider from 'contexts/UserProvider';
import { getAllProfilesQueryMock } from '../../AddProfile/tests/mock';
import { profileDetailsMutationMock, profileDetailsQueryMock } from './mock';
import ProfileDetails from '..';

jest.mock('rc-upload/lib/uid.js', () => ({
  __esModule: true,
  default: () => '1234',
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
jest.mock('react-router-dom', () => ({
  useParams: () => ({
    id: 123,
  }),
  useHistory: () => ({ push: jest.fn() }),
}));
const mockProp = {
  id: 123,
  email: 'test@test.com',
  role: 'admin',
  customerId: 2,
  updateUser: jest.fn(),
  updateToken: jest.fn(),
};

describe('<ProfileDetails />', () => {
  afterEach(jest.resetModules);

  it('should render with Data', async () => {
    const { getByLabelText } = render(
      <MockedProvider
        mocks={[profileDetailsQueryMock.success, getAllProfilesQueryMock.success]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <ProfileDetails />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByLabelText('Profile Name')).toHaveValue('Radius-Profile'));
  });

  it('should show error when query return error', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[profileDetailsQueryMock.error]} addTypename={false}>
        <UserProvider {...mockProp}>
          <ProfileDetails />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Failed to load profile data.')).toBeVisible());
  });

  it('should render with Data and update successfully', async () => {
    const { getByLabelText, getByText, getByRole } = render(
      <MockedProvider
        mocks={[
          profileDetailsQueryMock.success,
          getAllProfilesQueryMock.success,
          profileDetailsMutationMock.updateSuccess,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <ProfileDetails />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByLabelText('Profile Name')).toHaveValue('Radius-Profile'));
    await waitFor(() => expect(getByText('0.0.0.0')).toBeVisible());
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(getByText('Profile successfully updated.')).toBeVisible());
  });
  it('should render with Data and show error when update mutation return error', async () => {
    const { getByLabelText, getByText, getByRole } = render(
      <MockedProvider
        mocks={[
          profileDetailsQueryMock.success,
          getAllProfilesQueryMock.success,
          profileDetailsMutationMock.updateError,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <ProfileDetails />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByLabelText('Profile Name')).toHaveValue('Radius-Profile'));
    await waitFor(() => expect(getByText('0.0.0.0')).toBeVisible());
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(getByText('Profile could not be updated.')).toBeVisible());
  });

  it('should render with Data and upload image successfully', async () => {
    global.URL.createObjectURL = jest.fn();

    const { getByLabelText, getByTestId, getByText } = render(
      <MockedProvider
        mocks={[
          profileDetailsQueryMock.successCaptivePortal,
          getAllProfilesQueryMock.success,
          profileDetailsMutationMock.uploadSuccess,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <ProfileDetails />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByLabelText('Profile Name')).toHaveValue('Captive-portal'));
    fireEvent.change(getByTestId('logoFile'), {
      target: {
        files: [
          {
            lastModified: 1595008730671,
            lastModifiedDate: undefined,
            name: 'testImg.jpg',
            size: 100,
            type: 'image/jpg',
            percent: 0,
            originFileObj: { uid: 'rc-upload-1595008718690-73' },
          },
        ],
      },
    });
    expect(getByText(/testImg\.jpg/)).toBeInTheDocument();

    await waitFor(() => expect(getByText('File successfully uploaded.')).toBeVisible());
  });
  it('should render with Data and show error when upload mutation return error', async () => {
    global.URL.createObjectURL = jest.fn();

    const { getByLabelText, getByTestId, getByText } = render(
      <MockedProvider
        mocks={[
          profileDetailsQueryMock.successCaptivePortal,
          getAllProfilesQueryMock.success,
          profileDetailsMutationMock.uploadError,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <ProfileDetails />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByLabelText('Profile Name')).toHaveValue('Captive-portal'));

    fireEvent.change(getByTestId('logoFile'), {
      target: {
        files: [
          {
            lastModified: 1595008730671,
            lastModifiedDate: undefined,
            name: 'testImg.jpg',
            size: 100,
            type: 'image/jpg',
            percent: 0,
            originFileObj: { uid: 'rc-upload-1595008718690-73' },
          },
        ],
      },
    });
    expect(getByText(/testImg\.jpg/)).toBeInTheDocument();

    await waitFor(() => expect(getByText('File could not be uploaded.')).toBeVisible());
  });
});
