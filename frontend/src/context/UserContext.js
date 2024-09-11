import React, { createContext } from "react";

import useAuth from "../hooks/useAuth";
import Login from "../components/pags/Auth/login";

const Context = createContext();

function UserProvider({ children }) {
  const { authenticated,register, logout,login} = useAuth();

  return (
    <Context.Provider value={{authenticated,register, logout, login }}>
      {children}
    </Context.Provider>
  );
}

export { Context, UserProvider };