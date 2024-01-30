import React, { useReducer } from "react";
import LoginContext from "./loginContext";

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      const { token, id } = action.payload;
      const updatedState = { ...state, login: true, token, id };
      localStorage.setItem("loginState", JSON.stringify(updatedState));
      return updatedState;

    case "LOGOUT":
      localStorage.removeItem("loginState");
      return { login: false, token: null, id: null };

    default:
      return state;
  }
}

export default function LoginContextProvider({ children }) {
  const template = {
    login: false,
    token: null,
    id: null,
  };
  const INITIAL_STATE =
    JSON.parse(localStorage.getItem("loginState")) || template;

  const [loginState, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <LoginContext.Provider value={{ loginState, dispatch }}>
      {children}
    </LoginContext.Provider>
  );
}
