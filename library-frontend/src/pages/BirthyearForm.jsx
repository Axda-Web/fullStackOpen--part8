import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_AUTHOR, ALL_AUTHORS, ALL_BOOKS } from '../queries';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const BirthyearForm = () => {
	const [authorName, setAuthorName] = useState('');
	const [birthyear, setBirthyear] = useState(null);

	const navigate = useNavigate();

	const { loading, error, data } = useQuery(ALL_AUTHORS);

	const [editAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
		onError: (error) => {
			const messages = error.graphQLErrors[0].message;
			console.log(
				'🚀 ~ file: BirthyearForm.jsx:13 ~ BirthyearForm ~ messages:',
				messages
			);
		}
	});

	if (loading) {
		return <div>loading...</div>;
	}

	if (error) {
		return <div>{error.message}</div>;
	}

	const authorsSelectOptions = data.allAuthors.map((a) => ({
		value: a.name,
		label: a.name
	}));

	const handleSubmit = (event) => {
		event.preventDefault();
		editAuthor({
			variables: {
				name: authorName,
				setBornTo: parseInt(birthyear)
			}
		});
		setAuthorName('');
		setBirthyear(null);
		navigate('/authors');
	};

	return (
		<div>
			<h3>Set birthyear</h3>
			<form onSubmit={handleSubmit}>
				<Select
					options={authorsSelectOptions}
					onChange={({ value }) => setAuthorName(value)}
				/>
				<label>
					Born
					<input
						type="number"
						onChange={({ target }) => setBirthyear(target.value)}
					/>
				</label>
				<br />
				<button type="submit">Update author</button>
			</form>
		</div>
	);
};
export default BirthyearForm;
