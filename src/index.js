import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Comment from './resolvers/Comment';
import Post from './resolvers/Post';
import User from './resolvers/User';
import Subscription from './resolvers/Subscription';

const pubsub = new PubSub()
;
const server = new GraphQLServer({
  typeDefs: './src/schemas/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
  },
  context: {
    db,
    pubsub
  },
});

server.start(() => {
  console.log('The server is up!');
});
