import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/users/check-auth", { withCredentials: true })
      .then((res) => {
        console.log(res);
        if (res.data.authenticated) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
