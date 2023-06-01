import { Route, Routes } from 'react-router-dom';
import pagesData from './pagesData';

const Router = () => {
	const pageRoutes = pagesData.map(({ path, component, title }) => (
		<Route key={title} path={path} element={component} />
	));

	return <Routes>{pageRoutes}</Routes>;
};

export default Router;
