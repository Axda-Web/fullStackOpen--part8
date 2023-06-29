import { BrowserRouter } from 'react-router-dom';
import Router from './pages/router';
import Navbar from './components/Navbar';
import { useSubscription } from '@apollo/client';
import { BOOK_ADDED } from './queries';

const App = () => {
	useSubscription(BOOK_ADDED, {
		onData: ({ data }) => {
			const { title: bookTitle } = data.data.bookAdded;
			window.alert(`New book: ${bookTitle} has been added!`);
		}
	});
	return (
		<BrowserRouter>
			<Navbar />
			<main>
				<Router />
			</main>
		</BrowserRouter>
	);
};

export default App;
