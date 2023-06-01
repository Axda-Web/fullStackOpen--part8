import { Link } from 'react-router-dom';

const Navbar = () => {
	const navBarStyle = {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: '30px',
		padding: '10px'
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
				<li style={{ listStyleType: 'none' }}>
					<Link to="/new-book">New Book</Link>
				</li>
				<li style={{ listStyleType: 'none' }}>
					<Link to="/edit-birthyear">Edit Birthyear</Link>
				</li>
			</ul>
		</nav>
	);
};
export default Navbar;
