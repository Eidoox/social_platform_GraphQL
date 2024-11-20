const { gql } = require("graphql-tag");

const postSchema = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    createdAt: String!
  }

  type Post {
    id: ID!
    content: String!
    author: User!
    likes: [User!]!
    comments: [Comment!]!
    createdAt: String!
    updatedAt: String
  }
  type PostResponse {
    post: Post
    message: String!
  }

  type Query {
    getPost(id: ID!): Post
  }

  type Mutation {
    createPost(content: String!): PostResponse
    likePost(postId: ID!): Post!
    addComment(postId: ID!, content: String!): Comment!
  }
`;

module.exports = postSchema;
