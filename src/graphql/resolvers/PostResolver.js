const postModel = require("../../models/PostModel");
const commentModel = require("../../models/CommentModel");

const postResolver = {
  Query: {},
  Mutation: {
    createPost: async (_, { content }, { user }) => {
      if (!user) {
        return { post: null, message: "Not Authenticated" };
      }
      try {
        const newPost = new postModel({
          content,
          createddBy: user.id,
        });

        const post = await newPost.save();
        await post.populate("author", "username email");

        return { post, message: "New post is created successfully.." };
        s;
      } catch (error) {
        console.log(error);
        return { post: null, message: "Server Error while post creation.." };
      }
    },
    addComment: async (_, { postId, content }, { user }) => {},
    likePost: async (_, { postId }, { user }) => {},
  },
};

module.exports = postResolver;
