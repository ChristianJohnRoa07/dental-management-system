import { createYoga, createSchema } from 'graphql-yoga';
import { UserService } from '@/app/services/users/user.services';
import { ERROR_CODES } from '@/lib/constants';

// 1. Define your Graph Type Definitions (Schema)
const typeDefs = /* GraphQL */ `
  enum Role {
    USER
    ADMIN
  }

  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    role: Role!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    registerUser(
      username: String!
      email: String!
      password: String!
      firstName: String!
      lastName: String!
    ): User!
  }
`;

// 2. Define your Resolvers (Mapping incoming graph operations directly to your services)
const resolvers = {
  Query: {
    users: async () => {
      return await UserService.getAll();
    },
  },
  Mutation: {
    registerUser: async (_parent: any, args: any) => {
      try {
        return await UserService.register(args);
      } catch (error: any) {
        // Formats the error text cleanly for the GraphQL response client extension
        throw new Error(error.message);
      }
    },
  },
};

// 3. Initialize the GraphQL Yoga Instance
const { handleRequest } = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response }, // Ensures Next.js native server response compatibility
});

// 4. Export standard Next.js Routing Handlers
export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };