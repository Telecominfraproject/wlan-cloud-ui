import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen } from '@testing-library/dom';
import UserProvider from 'contexts/UserProvider';
import { profilesMutationMock, profilesQueryMock } from './mock';
import Profiles from '..';

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

describe('<Profiles />', () => {
  afterEach(jest.resetModules);

  it('should render with Data', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[profilesQueryMock.success]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Router>
            <Profiles />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Radius-Profile')).toBeVisible());
  });

  it('should show error when query return error', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[profilesQueryMock.error]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Router>
            <Profiles />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Failed to load profiles.')).toBeVisible());
  });

  it('should render with Data and call onReload if reload button is clicked', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider
        mocks={[profilesQueryMock.success, profilesQueryMock.success]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <Profiles />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Radius-Profile')).toBeVisible());
    fireEvent.click(getByRole('button', { name: /reload/i }));
    await waitFor(() => expect(getByText('Radius-Profile')).toBeVisible());
  });

  it('should render with Data and show error if reload button is clicked', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider
        mocks={[profilesQueryMock.success, profilesQueryMock.error]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <Profiles />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Radius-Profile')).toBeVisible());
    fireEvent.click(getByRole('button', { name: /reload/i }));
    await waitFor(() => expect(getByText('Radius-Profile')).toBeVisible());
  });

  it('should render with Data and Load More Button Should show when isLastPage false', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider
        mocks={[profilesQueryMock.success, profilesQueryMock.loadmore]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <Profiles />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Radius-Profile')).toBeVisible());
    fireEvent.click(getByRole('button', { name: 'Load More' }));

    await waitFor(() => expect(getByText('TipWlan-cloud-Enterprise')).toBeVisible());
  });

  it('should render with Data and Delete profile successfully', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider
        mocks={[
          profilesQueryMock.success,
          profilesQueryMock.loadmore,
          profilesMutationMock.deleteSuccess,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <Profiles />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Radius-Profile')).toBeVisible());
    fireEvent.click(getByRole('button', { name: 'Load More' }));

    await waitFor(() => expect(getByText('TipWlan-cloud-Enterprise')).toBeVisible());
    fireEvent.click(screen.getByTitle('delete'));
    expect(getByRole('button', { name: 'Delete' }));
    fireEvent.click(getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(getByText('Profile successfully deleted.')).toBeVisible());
  });

  it('should render with Data and show error when Delete profile', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider
        mocks={[
          profilesQueryMock.success,
          profilesQueryMock.loadmore,
          profilesMutationMock.deleteError,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <Profiles />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Radius-Profile')).toBeVisible());
    fireEvent.click(getByRole('button', { name: 'Load More' }));

    await waitFor(() => expect(getByText('TipWlan-cloud-Enterprise')).toBeVisible());
    fireEvent.click(screen.getByTitle('delete'));
    expect(getByRole('button', { name: 'Delete' }));
    fireEvent.click(getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(getByText('Profile could not be deleted.')).toBeVisible());
  });
});
