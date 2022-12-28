const { Post } = require("../models/post");
const { PostComment } = require("../models/post-comments");
//create post
exports.createPost = async (req, res) => {
  try {
    var { userID, content, image } = req.body;

    if (!userID) {
      res.json({
        status: "Failed",
        message: "User ID is missing",
      });
    } else if (!content) {
      res.json({
        status: "Failed",
        message: "Content cannot be blenk. Please write something",
      });
    }

    content = content.trim();
    image = image.trim();

    const newPost = new Post({
      user: userID,
      content,
      image,
    });

    const post = await newPost.save();
    res.json({
      status: "Success",
      message: "Posted successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while creating your post",
    });
  }
};

//edit post
exports.editPost = async (req, res) => {
  try {
    const postID = req.params.id;
    const { image, content, userID } = req.body;

    //check if post exists
    const post = await Post.findOne({ _id: postID });
    if (post) {
      if (post.user != userID) {
        res.json({
          status: "Failed",
          message: "Anauthorized operation",
        });
      } else {
        const editedPost = await Post.findOneAndUpdate(
          { _id: postID },
          { image, content }
        );
        res.json({
          status: "Success",
          message: "Post updated successfully",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Post not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while editing post",
    });
  }
};

//delete post
exports.deletePost = async (req, res) => {
  try {
    const postID = req.params.id;
    const { userID } = req.body;

    //check if post exists
    const post = await Post.findOne({ _id: postID });
    if (post) {
      if (post.user != userID) {
        res.json({
          status: "Failed",
          message: "Anauthorized operation",
        });
      } else {
        await Post.findOneAndDelete({ _id: postID });
        res.json({
          status: "Success",
          message: "Post deleted successfully",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Post not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while delete post",
    });
  }
};

//get all posts
exports.getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate(
    "user",
    "firstName lastName profilePicture"
  );
  res.send({ posts });
};

//get single post
exports.getSinglePost = async (req, res) => {
  try {
    const postID = req.params.id;

    //check if post exists
    const post = await Post.findOne({ _id: postID }).populate(
      "user",
      "firstName lastName profilePicture"
    );
    if (post) {
      res.json({
        status: "Success",
        message: "Post found",
        data: post,
      });
    } else {
      res.json({
        status: "Failed",
        message: "Post not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting post",
    });
  }
};

//add post comment
exports.addPostComment = async (req, res) => {
  try {
    const postID = req.params.id;
    const { userID, content } = req.body;

    if (!content) {
      res.json({
        status: "Failed",
        message: "Please write something",
      });
    } else {
      //check if post exists
      const post = await Post.findOne({ _id: postID });
      if (post) {
        const newPostComment = new PostComment({
          user: userID,
          post: postID,
          content,
        });

        await newPostComment.save();
        res.json({
          status: "Success",
          message: "Comment added successfully",
        });
      } else {
        res.json({
          status: "Failed",
          message: "Post not found",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while adding comment",
    });
  }
};

//get post comments
exports.getPostComments = async (req, res) => {};

//delete post comment
exports.deletePostComment = async (req, res) => {};

//like post
exports.likePost = async (req, res) => {};

//unlike post
exports.unlikePost = async (req, res) => {};
