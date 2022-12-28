const express = require("express");
const {
  createPost,
  editPost,
  getAllPosts,
  deletePost,
  getSinglePost,
  addPostComment,
} = require("../controller/post");
const router = express.Router();

router.post("/create-post", createPost);
router.put("/edit-post/:id", editPost);
router.get("/get-all-posts", getAllPosts);
router.delete("/delete-posts/:id", deletePost);
router.get("/get-post/:id", getSinglePost);
router.post("/add-post-comment/:id", addPostComment);

module.exports = router;
