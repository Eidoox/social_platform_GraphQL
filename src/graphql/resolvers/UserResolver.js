const bcrypt = require("bcryptjs");
const userModel = require("../../models/UserModel");
const generateAccessToken = require("../../utils/JWT");
const mongoose = require("mongoose");

const userResolver = {
  Query: {
    // Fetch user by ID
    getUser: async (_, { id }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return null;
        }
        const user = await userModel
          .findById(id)
          .populate("followers", "username")
          .populate("following", "username");
        if (!user) {
          return null;
        }
        return user;
      } catch (error) {
        console.error("Error fetching user:", error.message);
        return null;
      }
    },
    // Get Current user based on the authorization header Bearer <access_token>
    currentUser: async (_, __, { user }) => {
      try {
        const currentUser = await userModel
          .findById(user._id)
          .populate("followers", "username")
          .populate("following", "username");
        if (!currentUser) {
          return null;
        }
        console.log(currentUser);
        return currentUser;
      } catch (error) {
        console.error("An error occurred", error);
        return null;
      }
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
          message: "Error! There is not account found with this email address",
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
    followUser: async (_, { userId }, { user }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return null;
        }
        // finding the user who current user want to follow...
        const targetUser = await userModel.findById(userId);
        if (!targetUser) {
          throw new Error("User to follow not found");
        }
        // Prevent self-following
        if (user.id === userId) {
          throw new Error("You cannot follow yourself");
        }

        // Update the target user's followers and current user's following
        await userModel.findByIdAndUpdate(userId, {
          $addToSet: { followers: user.id },
        });
        const updatedCurrentUser = await userModel
          .findByIdAndUpdate(
            user.id,
            {
              $addToSet: { following: userId },
            },
            { new: true }
          )
          .populate("followers", "username email")
          .populate("following", "username email");
        console.log(updatedCurrentUser);
        return updatedCurrentUser;
      } catch (error) {
        console.error("error occurred", error);
        return null;
      }
    },
    unfollowUser: async (_, { userId }, { user }) => {
      try {
        // Check if the target user exists
        const targetUser = await userModel.findById(userId);
        if (!targetUser) {
          throw new Error("User to unfollow not found");
        }

        // Prevent self-unfollowing
        if (user.id === userId) {
          throw new Error("You cannot unfollow yourself");
        }

        // Remove current user from the target user's followers
        await userModel.findByIdAndUpdate(userId, {
          $pull: { followers: user.id },
        });
        // Remove target user from the current user's following
        const updatedCurrentUser = await userModel
          .findByIdAndUpdate(
            user.id,
            {
              $pull: { following: userId },
            },
            { new: true }
          )
          .populate("followers", "username email")
          .populate("following", "username email");

        return updatedCurrentUser;
      } catch (error) {
        console.error("error occurred", error);
        return null;
      }
    },
  },
};

module.exports = userResolver;
