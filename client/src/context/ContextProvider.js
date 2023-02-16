import { createContext, useContext, useState } from "react";
const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  console.log(user);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppState = () => {
  return useContext(AppContext);
};
