import Books from './Books';
import Authors from './Authors';
import NewBook from './NewBook';
import BirthyearForm from './BirthyearForm';
import Login from './Login';

const pagesData = [
	{
		path: '/',
		component: <Books />,
		title: 'home'
	},
	{
		path: '/authors',
		component: <Authors />,
		title: 'authors'
	},
	{
		path: '/new-book',
		component: <NewBook />,
		title: 'new-book'
	},
	{
		path: '/edit-birthyear',
		component: <BirthyearForm />,
		title: 'edit-birthyear'
	},
	{
		path: '/login',
		component: <Login />,
		title: 'login'
	}
];

export default pagesData;
