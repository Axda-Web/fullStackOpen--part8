import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../queries';

const Recommendations = () => {
	const {
		loading: userLoading,
		error: userError,
		data: userData
	} = useQuery(ME);

	const {
		loading: booksLoading,
		error: booksError,
		data: booksData
	} = useQuery(ALL_BOOKS, {
		variables: { genre: userData?.me.favoriteGenre },
		skip: !userData?.me.favoriteGenre
	});

	if (userLoading || booksLoading) return <div>loading...</div>;
	if (userError || booksError) return <div>Error</div>;

	return (
		<div>
			<h2>Recommendations</h2>
			<p>
				Books in your favorite genre{' '}
				<span style={{ fontWeight: 'bold' }}>
					{userData?.me.favoriteGenre}
				</span>
			</p>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{booksData?.allBooks.map((b) => (
						<tr key={b.title}>
							<td>{b.title}</td>
							<td>{b.author.name}</td>
							<td>{b.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
export default Recommendations;
