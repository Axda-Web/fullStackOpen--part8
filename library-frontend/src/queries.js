import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
	query {
		allAuthors {
			id
			name
			born
			bookCount
		}
	}
`;

export const ALL_BOOKS = gql`
	query allBooks($author: String, $genre: String) {
		allBooks(author: $author, genre: $genre) {
			id
			title
			published
			author {
				id
				name
				born
				bookCount
			}
			genres
		}
	}
`;

export const ADD_BOOK = gql`
	mutation createBook(
		$title: String!
		$published: Int!
		$author: String!
		$genres: [String!]!
	) {
		addBook(
			title: $title
			published: $published
			author: $author
			genres: $genres
		) {
			id
			title
			published
			author {
				id
				name
				born
				bookCount
			}
			genres
		}
	}
`;

export const EDIT_AUTHOR = gql`
	mutation setBirthyear($name: String!, $setBornTo: Int!) {
		editAuthor(name: $name, setBornTo: $setBornTo) {
			id
			name
			born
			bookCount
		}
	}
`;

export const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`;

export const ME = gql`
	query {
		me {
			id
			username
			favoriteGenre
		}
	}
`;
