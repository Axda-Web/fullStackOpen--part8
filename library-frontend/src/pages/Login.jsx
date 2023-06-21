import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { LOGIN, ME, ALL_AUTHORS, ALL_BOOKS } from '../queries';
import { useTokenDispatch } from '../TokenContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = (/*{ setError }*/) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const tokenDispatch = useTokenDispatch();
	const navigate = useNavigate();

	const [login, result] = useMutation(LOGIN, {
		refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
		onError: (error) => {
			// setError(error.graphQLErrors[0]?.message);
			console.log(
				'🚀 ~ file: Login.jsx:15 ~ LoginForm ~ error.graphQLErrors[0]?.message:',
				error.graphQLErrors[0]?.message
			);
		}
	});

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value;
			tokenDispatch({
				type: 'SET_TOKEN',
				payload: token
			});
			localStorage.setItem('library-user-token', token);
			navigate('/');
		}
	}, [result.data]); // eslint-disable-line

	const submit = async (event) => {
		event.preventDefault();

		login({ variables: { username, password } });
	};

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					username{' '}
					<input
						value={username}
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password{' '}
					<input
						type="password"
						value={password}
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	);
};

LoginForm.propTypes = {
	setError: PropTypes.func.isRequired
};

export default LoginForm;
