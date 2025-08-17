import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/userContext";

const PrivateRoute = () => {
  const { user, loading } = useContext(UserContext);
  
  if (loading) return null; // or loading spinner
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
