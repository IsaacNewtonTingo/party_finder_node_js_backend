const { Post } = require("../models/post");

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
