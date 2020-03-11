import { SET_MENU } from './constants';

export function setMenu(menu) {
  return {
    type: SET_MENU,
    menu,
  };
}
