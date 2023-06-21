const { ApolloServer } = require('@apollo/server');
const { UserInputError } = require('apollo-server-errors');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const User = require('./models/user');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

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

const server = new ApolloServer({
	typeDefs,
	resolvers
});

startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req, res }) => {
		const auth = req ? req.headers.authorization : null;
		if (auth && auth.startsWith('Bearer ')) {
			const decodedToken = jwt.verify(
				auth.substring(7),
				process.env.JWT_SECRET
			);
			const currentUser = await User.findById(decodedToken.id);
			return { currentUser };
		}
	}
}).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
