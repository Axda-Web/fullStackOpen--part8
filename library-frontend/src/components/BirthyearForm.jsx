import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';

const BirthyearForm = () => {
	const [authorName, setAuthorName] = useState('');
	const [birthyear, setBirthyear] = useState(null);

	const [editAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
		onError: (error) => {
			const messages = error.graphQLErrors[0].message;
			console.log(
				'🚀 ~ file: BirthyearForm.jsx:13 ~ BirthyearForm ~ messages:',
				messages
			);
		}
	});

	const handleSubmit = (event) => {
		event.preventDefault();
		editAuthor({
			variables: {
				name: authorName,
				setBornTo: parseInt(birthyear)
			}
		});
	};

	return (
		<div>
			<h3>Set birthyear</h3>
			<form onSubmit={handleSubmit}>
				<label>
					Name
					<input
						type="text"
						onChange={({ target }) => setAuthorName(target.value)}
					/>
				</label>
				<br />
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
