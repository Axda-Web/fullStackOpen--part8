import { BrowserRouter } from 'react-router-dom';
import Router from './pages/router';
import Navbar from './components/Navbar';

const App = () => {
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
