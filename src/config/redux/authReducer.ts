import { ActionType, Action } from "./types";

export interface InitialState {
  isLogin: boolean;
  userData: Object;
}

const initialState: InitialState = {
  isLogin: false,
  userData: {},
};

export default function authReducer(
  state: InitialState = initialState,
  action: Action
) {
  if (action.type === ActionType.CHANGE_LOGIN) {
    return { ...state, isLogin: action.payload };
  }
  if (action.type === ActionType.SET_USER) {
    return { ...state, userData: action.payload };
  }
  return state;
}
