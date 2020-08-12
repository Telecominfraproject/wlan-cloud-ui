import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import UserProvider from 'contexts/UserProvider';
import { BrowserRouter as Router } from 'react-router-dom';
import { AccessPointsQueryMock } from './mock';
import AccessPoints from '..';

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

describe('<AccessPointDetails />', () => {
  afterEach(jest.resetModules);

  it('should render with data', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[AccessPointsQueryMock.filterEquipment.success]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Router>
            <AccessPoints checkedLocations={['2', '3', '4', '5', '6', '7', '8']} />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('AP 1')).toBeVisible());
  });

  it('error message should be visible with error true', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[AccessPointsQueryMock.filterEquipment.error]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Router>
            <AccessPoints checkedLocations={[1, 2, 3]} />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Failed to load equipment.')).toBeVisible());
  });

  it('click on Load More should fetch more data', async () => {
    const { getByRole, getByText } = render(
      <MockedProvider
        mocks={[
          AccessPointsQueryMock.filterEquipment.success,
          AccessPointsQueryMock.filterEquipment.loadmore,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <AccessPoints checkedLocations={['2', '3', '4', '5', '6', '7', '8']} />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('AP 1')).toBeVisible());
    fireEvent.click(getByRole('button', { name: /load more/i }));
    await waitFor(() => expect(getByText('AP 1')).toBeVisible());
  });

  it('click on reload button should refetch data', async () => {
    const { getByText, container } = render(
      <MockedProvider
        mocks={[
          AccessPointsQueryMock.filterEquipment.success,
          AccessPointsQueryMock.filterEquipment.success,
        ]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <AccessPoints checkedLocations={['2', '3', '4', '5', '6', '7', '8']} />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('AP 1')).toBeVisible());
    const reloadButton = container.querySelector(
      '.ant-btn.index-module__Button___VGygY.ant-btn-icon-only'
    );
    fireEvent.click(reloadButton);
    await waitFor(() => expect(getByText('Access points reloaded.')).toBeVisible());
  });

  it('click on reload button should not refetch data when query return error', async () => {
    const { getByText, container } = render(
      <MockedProvider mocks={[AccessPointsQueryMock.filterEquipment.success]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Router>
            <AccessPoints checkedLocations={['2', '3', '4', '5', '6', '7', '8']} />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('AP 1')).toBeVisible());
    const reloadButton = container.querySelector(
      '.ant-btn.index-module__Button___VGygY.ant-btn-icon-only'
    );
    fireEvent.click(reloadButton);
    await waitFor(() => expect(getByText('Access points could not be reloaded.')).toBeVisible());
  });
});
