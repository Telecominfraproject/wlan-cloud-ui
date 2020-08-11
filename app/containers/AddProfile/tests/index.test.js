import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';

import UserProvider from 'contexts/UserProvider';
import { addProfileMutationMock, getAllProfilesQueryMock } from './mock';
import AddProfile from '..';

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
const DOWN_ARROW = { keyCode: 40 };

describe('<AddProfile />', () => {
  afterEach(cleanup);
  it('should create profile when provide correct Mutation', async () => {
    const { getByText, getByLabelText, getByRole } = render(
      <MockedProvider
        mocks={[getAllProfilesQueryMock.success, addProfileMutationMock.success]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <AddProfile />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByRole('button', { name: 'Save' })).toBeVisible());

    fireEvent.change(getByLabelText('Name'), { target: { value: 'test' } });
    await waitFor(() => expect(getByLabelText('Name')).toHaveValue('test'));

    fireEvent.keyDown(getByLabelText('Type'), DOWN_ARROW);
    fireEvent.click(getByText('Access Point'));
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(getByText('Profile successfully created.')).toBeVisible());
  });
  it('should show error when provide incorrect Mutation', async () => {
    const { getByText, getByLabelText, getByRole } = render(
      <MockedProvider mocks={[getAllProfilesQueryMock.success]} addTypename={false}>
        <UserProvider {...mockProp}>
          <AddProfile />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByRole('button', { name: 'Save' })).toBeVisible());

    fireEvent.change(getByLabelText('Name'), { target: { value: 'test' } });
    await waitFor(() => expect(getByLabelText('Name')).toHaveValue('test'));

    fireEvent.keyDown(getByLabelText('Type'), DOWN_ARROW);
    fireEvent.click(getByText('Access Point'));
    fireEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(getByText('Profile could not be created.')).toBeVisible());
  });
});
