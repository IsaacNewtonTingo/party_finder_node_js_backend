const express = require("express");
const {
  createPost,
  editPost,
  getAllPosts,
  deletePost,
  getSinglePost,
  addPostComment,
  getPostComments,
  deletePostComment,
  likePostController,
  getPostLikes,
} = require("../controller/post");
const router = express.Router();

router.post("/create-post", createPost);
router.put("/edit-post/:id", editPost);
router.get("/get-all-posts", getAllPosts);
router.delete("/delete-posts/:id", deletePost);
router.get("/get-post/:id", getSinglePost);
router.post("/add-post-comment/:id", addPostComment);
router.get("/get-post-comments/:id", getPostComments);
router.delete("/delete-post-comment/:id", deletePostComment);
router.post("/like-or-unlike-post/:id", likePostController);
router.get("/get-post-likes/:id", getPostLikes);

module.exports = router;
