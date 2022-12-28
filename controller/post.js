const { Post } = require("../models/post");
const { PostComment } = require("../models/post-comments");
const { PostLike } = require("../models/post-likes");
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
        await PostComment.deleteMany({ post: postID });
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
exports.getPostComments = async (req, res) => {
  try {
    const postID = req.params.id;

    //check if post exists
    const post = await Post.findOne({ _id: postID });
    if (post) {
      //post found get comments
      const comments = await PostComment.find({}).populate(
        "user",
        "firstName lastName profilePicture"
      );
      res.json({
        status: "Success",
        message: "Comments found successfully",
        data: comments,
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
      message: "An error occured while getting comments",
    });
  }
};

//delete post comment
exports.deletePostComment = async (req, res) => {
  try {
    const postCommentID = req.params.id;
    const { userID } = req.body;

    //check if comment exists
    const comment = await PostComment.findOneAndDelete({
      $and: [{ user: userID }, { _id: postCommentID }],
    });
    if (comment) {
      res.json({
        status: "Success",
        message: "Comments deleted successfully",
      });
    } else {
      res.json({
        status: "Failed",
        message: "Comment not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while deleting comment",
    });
  }
};

//like post
exports.likePostController = async (req, res) => {
  try {
    const postID = req.params.id;
    const { userID } = req.body;

    //check if post exists
    const post = await Post.findOne({
      _id: postID,
    });
    if (post) {
      //check if post is already liked
      const likedPost = await PostLike.findOne({
        $and: [{ user: userID }, { post: postID }],
      });
      if (likedPost) {
        //has already liked
        //unlike
        await PostLike.deleteMany({
          $and: [{ user: userID }, { post: postID }],
        });

        res.json({
          status: "Success",
          message: "Post unliked successfully",
        });
      } else {
        //not liked
        const newPostLike = new PostLike({
          user: userID,
          post: postID,
        });

        await newPostLike.save();
        res.json({
          status: "Success",
          message: "Post liked successfully",
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
      message: "An error occured while liking the post",
    });
  }
};

//get post likes
exports.getPostLikes = async (req, res) => {
  try {
    const postID = req.params.id;

    //check if post exists
    const post = await Post.findOne({
      _id: postID,
    });
    if (post) {
      const postLikes = await PostLike.find({
        post: postID,
      }).populate("user", "firstName lastName profilePicture");

      res.json({
        status: "Success",
        message: "Post likes retrieved successfully",
        data: postLikes,
        count: postLikes.length,
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
      message: "An error occured while getting likes",
    });
  }
};
