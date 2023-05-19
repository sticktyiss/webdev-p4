const { User } = require("../models/user");
const { Post } = require("../models/post");

module.exports = {
  getAllPosts: async (req, res) => {
    try {
      console.log("got all posts");
      const posts = await Post.findAll({
        where: { privateStatus: false },
        include: [
          {
            model: User,
            required: true,
            attributes: [`username`],
          },
        ],
      });
      res.status(200).send(posts);
    } catch (theseHands) {
      console.log("ERROR IN getAllPosts");
      console.log(theseHands);
      res.sendStatus(400);
    }
  },
  getCurrentUserPosts: async (req, res) => {
    try {
      console.log("get current user posts");
      const { userId } = req.params;
      const posts = await Post.findAll({
        where: { userId: userId },
        include: [
          {
            model: User,
            required: true,
            attributes: [`username`],
          },
        ],
      });
      res.status(200).send(posts);
    } catch (theseHands) {
      console.log('getting users posts failed',theseHands);
      res.sendStatus(400);
    }
  },
  addPost: async (req, res) => {
    try {
      console.log("added post");
      const { title, content, status, userId } = req.body;
      await Post.create({ title, content, privateStatus: status, userId });
      res.sendStatus(200);
    } catch (theseHands) {
      console.log("Adding post failed", theseHands);
      res.sendStatus(400);
    }
  },
  editPost: async (req, res) => {
    try {
      console.log("edited post");
      const { id } = req.params;
      const { status } = req.body;
      await Post.update({ privateStatus: status }, { where: { id: +id } });
      res.sendStatus(200);
    } catch (theseHands) {
      console.log("Editing post failed", theseHands);
      res.sendStatus(400);
    }
  },
  deletePost: async (req, res) => {
    try {
      console.log("deleted post");
      const { id } = req.params;
      await Post.destroy({ where: { id: id } });
      res.sendStatus(200);
    } catch (theseHands) {
      console.log("Deleting post failed", theseHands);
      res.sendStatus(400);
    }
  },
};
