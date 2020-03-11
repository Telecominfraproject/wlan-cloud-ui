import { createSelector } from 'reselect';

import { STATE_KEY } from './constants';
import { initialState } from './reducer';

const selectLayout = state => state[STATE_KEY] || initialState;

const makeSelectMenu = () => createSelector(selectLayout, state => state.menu);

export { selectLayout, makeSelectMenu };
