const { GraphQLError } = require('graphql');
const { UserInputError } = require('apollo-server-errors');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const jwt = require('jsonwebtoken');
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

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
		},
		me: (root, args, context) => {
			return context.currentUser;
		},
		genres: async () => {
			try {
				const genres = await Book.distinct('genres').exec();
				return genres;
			} catch (err) {
				console.log(err);
			}
		}
	},
	Mutation: {
		addBook: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new GraphQLError('wrong credentials', {
					extensions: { code: 'BAD_USER_INPUT' }
				});
			}

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
				try {
					await author.save();
				} catch (error) {
					throw new UserInputError(error.message, {
						invalidArgs: args
					});
				}
			}

			const populatedAuthor = await Author.findOne({ name: args.author });
			const book = new Book({ ...args, author: populatedAuthor });

			try {
				await book.save();
				pubsub.publish('BOOK_ADDED', { bookAdded: book });
				return book;
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args
				});
			}
		},
		editAuthor: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new GraphQLError('wrong credentials', {
					extensions: { code: 'BAD_USER_INPUT' }
				});
			}

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
		},
		createUser: async (root, args) => {
			const user = new User({
				username: args.username,
				favoriteGenre: args.favoriteGenre
			});

			return user.save().catch((error) => {
				throw new GraphQLError('Creating the user failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.username,
						error
					}
				});
			});
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username });

			if (!user || args.password !== 'secret') {
				throw new GraphQLError('wrong credentials', {
					extensions: {
						code: 'BAD_USER_INPUT'
					}
				});
			}

			const userForToken = {
				username: user.username,
				id: user._id
			};

			return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
		}
	},
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
		}
	}
};

module.exports = resolvers;
