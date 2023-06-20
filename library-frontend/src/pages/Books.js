import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = () => {
	const [genre, setGenre] = useState('');
	const [filteredBooks, setFilteredBooks] = useState([]);
	const { loading, error, data } = useQuery(ALL_BOOKS);

	if (loading) {
		return <div>loading...</div>;
	}

	if (error) {
		return <div>{error.message}</div>;
	}

	const genres = [
		...Array.from(new Set(data.allBooks.flatMap((a) => a.genres))),
		'All genres'
	];

	const handleFilterClick = (e) => {
		if (e.target.textContent === 'All genres') {
			setGenre('');
			setFilteredBooks(data.allBooks);
			return;
		}
		setGenre(e.target.textContent);
		const filteredByGenre = data.allBooks.filter((b) =>
			b.genres.includes(e.target.textContent)
		);
		setFilteredBooks(filteredByGenre);
	};
	return (
		<div>
			<h2>books</h2>
			{genre && (
				<p>
					in genre <span style={{ fontWeight: 'bold' }}>{genre}</span>
				</p>
			)}
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{filteredBooks.length
						? filteredBooks.map((a) => (
								<tr key={a.title}>
									<td>{a.title}</td>
									<td>{a.author.name}</td>
									<td>{a.published}</td>
								</tr>
						  ))
						: data.allBooks.map((a) => (
								<tr key={a.title}>
									<td>{a.title}</td>
									<td>{a.author.name}</td>
									<td>{a.published}</td>
								</tr>
						  ))}
				</tbody>
			</table>
			<div style={{ marginTop: '10px' }}>
				{genres.map((g, i) => (
					<button
						key={i}
						style={{
							marginRight: '10px'
						}}
						onClick={handleFilterClick}
					>
						{g}
					</button>
				))}
			</div>
		</div>
	);
};

export default Books;
