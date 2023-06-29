import { Navigate } from 'react-router-dom';
import { useTokenValue } from '../TokenContext';

const ProtectedRoute = ({ children }) => {
	const token = useTokenValue();
	if (!token) return <Navigate to="/login" replace={true} />;

	return children;
};
export default ProtectedRoute;
