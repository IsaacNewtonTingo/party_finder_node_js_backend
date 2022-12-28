const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: "String",
    image: String,
  },
  { timestamps: true }
);

exports.Post = mongoose.model("Post", PostSchema);
