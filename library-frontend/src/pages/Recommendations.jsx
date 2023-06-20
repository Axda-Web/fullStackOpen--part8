import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../queries';

const Recommendations = () => {
	const {
		loading: userLoading,
		error: userError,
		data: { me }
	} = useQuery(ME);

	const {
		loading: booksLoading,
		error: booksError,
		data: { allBooks }
	} = useQuery(ALL_BOOKS, {
		variables: { genre: me.favoriteGenre },
		skip: !me.favoriteGenre
	});

	if (userLoading || booksLoading) return <div>loading...</div>;
	if (userError || booksError) return <div>{userError.message}</div>;

	return (
		<div>
			<h2>Recommendations</h2>
			<p>
				Books in your favorite genre{' '}
				<span style={{ fontWeight: 'bold' }}>{me.favoriteGenre}</span>
			</p>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{allBooks.map((b) => (
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
