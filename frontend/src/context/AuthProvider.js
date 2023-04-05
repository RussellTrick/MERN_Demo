import { createContext, useEffect, useState } from "react";
import axios from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ authenticated: false });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    axios
      .get("/users/check-auth", { withCredentials: true })
      .then((res) => {
        console.log(res);
        if (res.data.authenticated) {
          setAuth((prevAuth) => ({ ...prevAuth, authenticated: true }));
        } else {
          setAuth((prevState) => ({ ...prevState, authenticated: false }));
        }
      })
      .then(() => {
        console.log(auth.authenticated);
      })
      .catch((err) => {
        console.error(err);
        setAuth((prevState) => ({ ...prevState, authenticated: false }));
      });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
