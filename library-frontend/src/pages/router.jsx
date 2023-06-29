import { Route, Routes } from 'react-router-dom';
import pagesData from './pagesData';
import ProtectedRoute from '../components/ProtectedRoute';

const Router = () => {
	const pageRoutes = pagesData.map(({ path, component, title }) => {
		if (title === 'new-book' || title === 'edit-birthyear')
			return (
				<Route
					key={path}
					path={path}
					element={<ProtectedRoute>{component}</ProtectedRoute>}
				/>
			);
		else {
			return <Route key={path} path={path} element={component} />;
		}
	});

	return <Routes>{pageRoutes}</Routes>;
};

export default Router;
