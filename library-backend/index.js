const { ApolloServer } = require('@apollo/server');
const { UserInputError } = require('apollo-server-errors');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');
// const { v4: uuidv4 } = require('uuid');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Author = require('./models/author');
const Book = require('./models/book');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connection to MongoDB:', error.message);
	});

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
	Author: {
		bookCount: async (root) => {
			const author = await Author.findOne({ name: root.name });
			const authorBooks = await Book.find({ author: author.id });
			return authorBooks.length;
		}
	},
	Query: {
		bookCount: () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),
		allBooks: async (root, args) => {
			if (args.author && args.genre) {
				const author = await Author.findOne({ name: args.author });
				if (!!author) {
					const filteredBooks = await Book.find({
						author: author.id,
						genres: { $in: args.genre }
					}).populate('author');
					return filteredBooks;
				}
			}

			if (args.author) {
				const author = await Author.findOne({ name: args.author });
				if (!!author) {
					const filteredBooks = await Book.find({
						author: author.id
					}).populate('author');
					return filteredBooks;
				}
			}

			if (args.genre) {
				const filterredBooks = await Book.find({
					genres: { $in: args.genre }
				}).populate('author');
				return filterredBooks;
			}

			const books = await Book.find({}).populate('author');
			return books;
		},
		allAuthors: async () => {
			return await Author.find({});
		}
	},
	Mutation: {
		addBook: async (root, args) => {
			const bookAlreadyExists = await Book.findOne({
				title: args.title
			});
			const authorAlreadyExists = await Author.findOne({
				name: args.author
			});

			if (bookAlreadyExists) {
				throw new UserInputError('Book already exists', {
					invalidArgs: args.title
				});
			}

			if (!authorAlreadyExists) {
				const author = new Author({
					name: args.author,
					born: null
				});
				await author.save();
			}

			const populatedAuthor = await Author.findOne({ name: args.author });
			const book = new Book({ ...args, author: populatedAuthor });

			await book.save();
			return book;
		},
		editAuthor: async (root, args) => {
			const author = await Author.findOne({ name: args.name });

			if (!author) {
				throw new UserInputError('Author not found', {
					invalidArgs: args.name
				});
			}

			await Author.updateOne(
				{ _id: author._id },
				{ $set: { born: args.setBornTo } }
			);
			const updatedAuthor = await Author.findOne({ name: args.name });
			return updatedAuthor;
		}
	}
};

const server = new ApolloServer({
	typeDefs,
	resolvers
});

startStandaloneServer(server, {
	listen: { port: 4000 }
}).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
