import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter as Router } from 'react-router-dom';
import UserProvider from 'contexts/UserProvider';
import { alarmsQueryMock } from './mock';
import Alarms from '..';

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

describe('<Alarms />', () => {
  afterEach(jest.resetModules);

  it('should render with Data', async () => {
    const { getAllByText } = render(
      <MockedProvider mocks={[alarmsQueryMock.success]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Router>
            <Alarms />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getAllByText('Available memory is too low')[0]).toBeVisible());
  });

  it('should show error when query return error', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[alarmsQueryMock.error]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Router>
            <Alarms />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Failed to load alarms.')).toBeVisible());
  });

  it('should work with the onLoadMore', async () => {
    const { getAllByText, getByRole } = render(
      <MockedProvider
        mocks={[alarmsQueryMock.success, alarmsQueryMock.loadmore]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <Alarms />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getAllByText('Available memory is too low')[0]).toBeVisible());

    fireEvent.click(getByRole('button', { name: /load more/i }));
    await waitFor(() => expect(getAllByText('Available memory is too low')[0]).toBeVisible());
  });

  it('should work with the onReload', async () => {
    const { getAllByText, getByText, container } = render(
      <MockedProvider
        mocks={[alarmsQueryMock.success, alarmsQueryMock.success]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <Router>
            <Alarms />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getAllByText('Available memory is too low')[0]).toBeVisible());

    const reloadButton = container.querySelector(
      '.ant-btn.index-module__Button___VGygY.ant-btn-icon-only'
    );
    fireEvent.click(reloadButton);
    await waitFor(() => expect(getByText('Alarms reloaded.')).toBeVisible());
  });

  it('should show error when reload wuery return error', async () => {
    const { getAllByText, getByText, container } = render(
      <MockedProvider mocks={[alarmsQueryMock.success]} addTypename={false}>
        <UserProvider {...mockProp}>
          <Router>
            <Alarms />
          </Router>
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getAllByText('Available memory is too low')[0]).toBeVisible());

    const reloadButton = container.querySelector(
      '.ant-btn.index-module__Button___VGygY.ant-btn-icon-only'
    );
    fireEvent.click(reloadButton);
    await waitFor(() => expect(getByText('Alarms reloaded.')).toBeVisible());
  });
});
