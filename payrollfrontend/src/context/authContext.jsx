import React, {createContext, useState, useContext } from 'react';

const UserContext = createContext();

 const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
    const login = (user) => {
      setUser(user);
    };
      const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
      };
return (
  <UserContext.Provider value={{user, login, logout}}>
    {children}
  </UserContext.Provider>
  )
}
export const useAuth = () => useContext(UserContext);
export default AuthProvider;