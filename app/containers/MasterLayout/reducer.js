import produce from 'immer';
import { SET_MENU } from './constants';

// The initial state of the App
export const initialState = {
  collapsed: false,
  isMobile: false,
  screen: 'lg',
};

/* eslint-disable default-case, no-param-reassign */
const layoutReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_MENU:
        draft.collapsed = action.menu.collapsed;
        draft.isMobile = action.menu.isMobile;
        draft.screen = action.menu.screen;
        return draft;
      default:
        return draft;
    }
  });

export default layoutReducer;
