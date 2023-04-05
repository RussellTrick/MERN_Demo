import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  console.log("authenticated", auth.authenticated);
  console.log("location", location);

  return auth?.authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
