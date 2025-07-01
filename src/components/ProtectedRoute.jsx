import { Navigate } from "react-router-dom";
import { useAuth } from "../context/context";

function ProtectedRoute({ children, allowedRoles }) {
	const { isAuth, loading, user } = useAuth();

	if (loading) {
		return (null);
	}

	if (!isAuth) {
		return <Navigate to="/sign-in" replace />;
	}

	if (allowedRoles && user && !allowedRoles.includes(user.role)) {
		return <Navigate to="/unauthorized" replace />;
	}

	return <>{children}</>;
}

export default ProtectedRoute;
