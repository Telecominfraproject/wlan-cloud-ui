import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { render, waitFor } from '@testing-library/react';
import UserProvider from 'contexts/UserProvider';
import { BulkEditAPsQueryMock } from './mock';
import BulkEditAPs from '..';

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

const locations = [
  {
    children: [
      {
        children: [
          {
            id: '4',
            key: '4',
            locationType: 'FLOOR',
            name: 'Floor 1',
            parentId: '3',
            title: '',
            value: '4',
            __typename: 'Location',
          },
          {
            id: '5',
            key: '5',
            locationType: 'FLOOR',
            name: 'Floor 2',
            parentId: '3',
            title: '',
            value: '5',
            __typename: 'Location',
          },
          {
            id: '6',
            key: '6',
            locationType: 'FLOOR',
            name: 'Floor 3',
            parentId: '3',
            title: '',
            value: '6',
            __typename: 'Location',
          },
        ],
        id: '3',
        key: '3',
        locationType: 'BUILDING',
        name: 'Building 1',
        parentId: '2',
        title: '',
        value: '3',
        __typename: 'Location',
      },
      {
        id: '7',
        key: '7',
        locationType: 'BUILDING',
        name: 'Building 2',
        parentId: '2',
        title: '',
        value: '7',
        __typename: 'Location',
      },
    ],
    id: '2',
    key: '2',
    locationType: 'SITE',
    name: 'Menlo Park',
    parentId: '0',
    title: '',
    value: '2',
    __typename: 'Location',
  },
  {
    id: '8',
    key: '8',
    locationType: 'SITE',
    name: 'Ottawa',
    parentId: '0',
    title: 'test',
    value: '8',
    __typename: 'Location',
  },
];

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    id: '6',
  }),
  useHistory: () => ({ push: jest.fn() }),
}));
describe('<BulkEditAPs />', () => {
  afterEach(jest.resetModules);

  it('should render with data', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[BulkEditAPsQueryMock.filterEquipmentBulkEditAps.success]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <BulkEditAPs
            locations={locations}
            checkedLocations={['2', '3', '4', '5', '6', '7', '8']}
          />
        </UserProvider>
      </MockedProvider>
    );

    await waitFor(() => expect(getByText('AP 1')).toBeVisible());
  });

  it('error message should be visible with error true', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[BulkEditAPsQueryMock.filterEquipmentBulkEditAps.error]}
        addTypename={false}
      >
        <UserProvider {...mockProp}>
          <BulkEditAPs
            locations={locations}
            checkedLocations={['2', '3', '4', '5', '6', '7', '8']}
          />
        </UserProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('Failed to load equipments data.')).toBeVisible());
  });
});
