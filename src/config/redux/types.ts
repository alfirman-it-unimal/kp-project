export enum ActionType {
  CHANGE_LOADING = "CHANGE_LOADING",
  CHANGE_LOGIN = "CHANGE_LOGIN",
  SET_USER = "SET_USER",
}

export interface Action {
  type: ActionType.CHANGE_LOGIN | ActionType.SET_USER | ActionType.CHANGE_LOADING;
  payload: any;
}
