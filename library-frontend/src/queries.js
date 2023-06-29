import { gql } from '@apollo/client';

const BOOK_DETAILS = gql`
	fragment BookDetails on Book {
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
`;

const AUTHOR_DETAILS = gql`
	fragment AuthorDetails on Author {
		id
		name
		born
		bookCount
	}
`;

export const ALL_AUTHORS = gql`
	query {
		allAuthors {
			...AuthorDetails
		}
	}
	${AUTHOR_DETAILS}
`;

export const ALL_BOOKS = gql`
	query allBooks($author: String, $genre: String) {
		allBooks(author: $author, genre: $genre) {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
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
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`;

export const EDIT_AUTHOR = gql`
	mutation setBirthyear($name: String!, $setBornTo: Int!) {
		editAuthor(name: $name, setBornTo: $setBornTo) {
			...AuthorDetails
		}
	}
	${AUTHOR_DETAILS}
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

export const GENRES = gql`
	query {
		genres
	}
`;

export const BOOK_ADDED = gql`
	subscription {
		bookAdded {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`;
