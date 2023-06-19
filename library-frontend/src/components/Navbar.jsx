import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTokenValue, useTokenDispatch } from '../TokenContext';

const Navbar = () => {
	const navigate = useNavigate();
	const token = useTokenValue();
	const tokenDispatch = useTokenDispatch();

	const navBarStyle = {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: '30px',
		padding: '10px'
	};

	const handleLogoutClick = () => {
		tokenDispatch({
			type: 'SET_TOKEN',
			payload: null
		});
		localStorage.clear();
		navigate('/login');
	};

	return (
		<nav>
			<ul style={navBarStyle}>
				<li style={{ listStyleType: 'none' }}>
					<Link to="/">Books</Link>
				</li>
				<li style={{ listStyleType: 'none' }}>
					<Link to="/authors">Authors</Link>
				</li>
				{token && (
					<li style={{ listStyleType: 'none' }}>
						<Link to="/new-book">New Book</Link>
					</li>
				)}
				{token && (
					<li style={{ listStyleType: 'none' }}>
						<Link to="/edit-birthyear">Edit Birthyear</Link>
					</li>
				)}
				{token ? (
					<li style={{ listStyleType: 'none' }}>
						<button onClick={handleLogoutClick}>Logout</button>
					</li>
				) : (
					<Link to="/login">Login</Link>
				)}
			</ul>
		</nav>
	);
};
export default Navbar;
