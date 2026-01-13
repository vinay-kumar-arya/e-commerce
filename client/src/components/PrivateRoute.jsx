// components/PrivateRoute.js
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, loggedInUser }) => {
  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
