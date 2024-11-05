require("dotenv").config();

const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const connectDB = require("./config/mongodb");
const userSchema = require("./graphql/schemas/UserSchema");
const userResolver = require("./graphql/resolvers/UserResolver");
const getCurrentUserContext = require("./middlewares/AuthenticateUsersContext");
const app = express();

(async () => {
  try {
    await connectDB();
    console.log("Database connected successfully.");

    const server = new ApolloServer({
      typeDefs: userSchema,
      resolvers: userResolver,
    });

    await server.start();

    app.use(
      "/graphql",
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          return await getCurrentUserContext(req); // Return the result of getCurrentUserContext
        },
      })
    );

    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port 5000`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
})();
