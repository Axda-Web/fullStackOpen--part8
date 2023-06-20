import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS, GENRES } from '../queries';

const Books = () => {
	const [selectedGenre, setSelectedGenre] = useState('');

	const {
		loading: booksLoading,
		error: booksError,
		data: booksData
	} = useQuery(ALL_BOOKS, {
		variables: { genre: selectedGenre }
	});

	const { genresLoading, genresError, data: genresData } = useQuery(GENRES);

	if (booksLoading || genresLoading) {
		return <div>loading...</div>;
	}

	if (booksError || genresError) {
		return <div>Error</div>;
	}

	const handleFilterClick = (e) => {
		if (e.target.textContent === 'All genres') {
			setSelectedGenre('');
			return;
		}
		setSelectedGenre(e.target.textContent);
	};
	return (
		<div>
			<h2>books</h2>
			{selectedGenre && (
				<p>
					in genre{' '}
					<span style={{ fontWeight: 'bold' }}>{selectedGenre}</span>
				</p>
			)}
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{booksData?.allBooks.map((a) => (
						<tr key={a.title}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div style={{ marginTop: '10px' }}>
				{genresData?.genres
					.concat(['All genres'])
					.map((genre, index) => (
						<button
							key={index}
							style={{
								marginRight: '10px'
							}}
							onClick={handleFilterClick}
						>
							{genre}
						</button>
					))}
			</div>
		</div>
	);
};

export default Books;
