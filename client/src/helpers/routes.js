import { Navigate, useLocation } from "react-router-dom";

export function IfUserRedirect({ user, signedInPath, children }) {
  if (user) {
    return <Navigate to={{ pathname: signedInPath }} />;
  }
  return children;
}

export function ProtectedRoute({ user, signedInPath, children }) {
  const { pathname } = useLocation();
  if (!user) {
    return <Navigate to={signedInPath} state={{ previousPath: pathname }} />;
  }

  return children;
}
