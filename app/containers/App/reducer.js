import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({});

// const mergedState = initialState.merge(getItem(FILTERS_LS_KEY));

function appReducer(currentState = initialState, action) {
  const state = currentState.setIn(['error'], false);

  switch (action.type) {
    default:
      return state;
  }
}

export default appReducer;
