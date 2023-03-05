const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostLikeSchema = new Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

exports.PostLike = mongoose.model("PostLike", PostLikeSchema);
