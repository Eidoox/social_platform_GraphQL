const { gql } = require("graphql-tag");

const userSchema = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    followers: [User]
    following: [User]
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    accessToken: String
    user: User
    message: String
  }

  # Define queries of users
  type Query {
    getUser(id: ID!): User
    currentUser: User
  }

  # Define mutations of users
  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    followUser(userId: ID!): User
    unfollowUser(userId: ID!): User
  }
`;

module.exports = userSchema;
