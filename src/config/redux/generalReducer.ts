import { Action, ActionType } from "./types";

interface InitialState {
  isLoading: boolean;
}

const initialState: InitialState = {
  isLoading: false,
};

export default function generalReducer(
  state: InitialState = initialState,
  action: Action
) {
  if (action.type === ActionType.CHANGE_LOADING) {
    return { ...state, isLoading: action.payload };
  }
  return state;
}
