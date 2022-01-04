import { TypedUseSelectorHook, useSelector } from "react-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import authReducer from "./authReducer";
import generalReducer from "./generalReducer";

const rootReducer = combineReducers({ authReducer, generalReducer });

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

export type RootState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;