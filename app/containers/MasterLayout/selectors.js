import { createSelector } from 'reselect';

import { STATE_KEY } from './constants';
import { initialState } from './reducer';

const selectLayout = state => state[STATE_KEY] || initialState;

const makeSelectCollapsed = () => createSelector(selectLayout, state => state.collapsed);
const makeSelectIsMobile = () => createSelector(selectLayout, state => state.isMobile);
const makeSelectScreen = () => createSelector(selectLayout, state => state.screen);

export { selectLayout, makeSelectCollapsed, makeSelectIsMobile, makeSelectScreen };
