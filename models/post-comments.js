const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostCommentSchema = new Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: String,
  },
  { timestamps: true }
);

exports.PostComment = mongoose.model("PostComment", PostCommentSchema);
