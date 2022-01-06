import { Dispatch } from "redux";
import { firebaseAddData, firebaseSignIn, firebaseUpdateDocument, firebaseUploadFile } from "../firebase";
import { Action, ActionType } from "./types";

const { CHANGE_LOADING, CHANGE_LOGIN, SET_USER } = ActionType;

export const login =
  (email: string, password: string, cb?: Function) =>
  (dispatch: Dispatch<Action>) => {
    dispatch({ type: CHANGE_LOADING, payload: true });
    firebaseSignIn(email, password)
      .then((userData) => {
        dispatch({ type: SET_USER, payload: userData });
        dispatch({ type: CHANGE_LOGIN, payload: true });
        cb && cb();
      })
      .catch((err) => alert(err))
      .finally(() => dispatch({ type: CHANGE_LOADING, payload: false }));
  };

export const logout = (cb?: Function) => (dispatch: Dispatch<Action>) => {
  dispatch({ type: CHANGE_LOGIN, payload: false });
  dispatch({ type: SET_USER, payload: {} });
  cb && cb();
};

export const addData =
  (data: Object, path: string, cb?: Function) =>
  (dispatch: Dispatch<Action>) => {
    dispatch({ type: CHANGE_LOADING, payload: true });
    firebaseAddData(data, path)
      .then(() => cb && cb())
      .catch((e) => alert(e))
      .finally(() => dispatch({ type: CHANGE_LOADING, payload: false }));
  };

export const updateDoc =
  (path: string, id: string, data: Object, cb?: Function) =>
  (dispatch: Dispatch<Action>) =>
    firebaseUpdateDocument(path, id, data)
      .then(() => cb && cb())
      .catch((e) => alert(e));

export const uploadFile =
  (file: any, filename: string, cb: Function) =>
  (dispatch: Dispatch<Action>) => {
    dispatch({ type: CHANGE_LOADING, payload: true });
    firebaseUploadFile(file, filename)
      .then((res) => cb(res))
      .catch((e) => console.log(e))
      .finally(() => dispatch({ type: CHANGE_LOADING, payload: false }));
  };
