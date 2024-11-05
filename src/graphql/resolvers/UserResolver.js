const bcrypt = require("bcryptjs");
const userModel = require("../../models/UserModel");
const generateAccessToken = require("../../utils/JWT");

const userResolver = {
  Query: {
    // Fetch user by ID
    getUser: async (_, { id }) => {
      return await userModel.findById(id);
    },
    currentUser: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await userModel.findById(user.id);
    },
  },

  Mutation: {
    // Register a new user
    register: async (_, { username, email, password }) => {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return {
          accessToken: "",
          user: null,
          message: "Error! Email address already registered",
        };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // Create and Save new user
      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
      });

      const user = await newUser.save();
      const accessToken = generateAccessToken(user._id);
      return {
        accessToken,
        user,
        message: "Email address registered successfully..",
      };
    },

    // Login users
    login: async (_, { email, password }) => {
      const existingUser = await userModel.findOne({ email });
      if (!existingUser) {
        return {
          accessToken: "",
          user: null,
          message: "Error! There is not accout found with this email address",
        };
      }

      const passwordMatching = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!passwordMatching) {
        return {
          accessToken: "",
          user: null,
          message: "Error! Password wrong",
        };
      }
      const accessToken = generateAccessToken(existingUser._id);
      return {
        accessToken,
        user: existingUser,
        message: "Signed In successfully..",
      };
    },
  },
};

module.exports = userResolver;
