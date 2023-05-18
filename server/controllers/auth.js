require("dotenv").config();
const { SECRET } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/user");

createToken = (username, id) => {
  return jwt.sign({ username, id }, SECRET, { expiresIn: "2 days" });
};

module.exports = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      let foundUser = await User.findOne({ where: { username } });
      if (foundUser) {
        const isAuthenticated = bcrypt.compareSync(
          password,
          foundUser.hashedPassword
        );
        if (isAuthenticated) {
          const token = createToken(
            foundUser.dataValues.username,
            foundUser.dataValues.id
          );
          const exp = Date.now() + 1000 * 60 * 60 * 48;
          res.status(200).send({
            username: foundUser.dataValues.username,
            userId: foundUser.dataValues.id,
            token,
            exp,
          });//TODO: this is the last thing I did--------------------------//
        } else {
          console.log("Password is incorrect.");
        }
      } else {
        console.log("That username does not exist.");
      }
    } catch (theseHands) {
      console.log("Login Failed");
      console.log(theseHands);
      res.sendStatus(400);
    }
  },
  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      let foundUser = await User.findOne({ where: { username } });
      if (foundUser) {
        res.sendStatus(400).send("username already exists");
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = await User.create({
          username,
          hashedPassword: hash,
        });
        console.log(newUser);
        const token = createToken(
          newUser.dataValues.username,
          newUser.dataValues.id
        );
        console.log("TOOOKEN", token);
        const exp = Date.now() + 1000 * 60 * 60 * 48;
        res.status(200).send({
          username: newUser.dataValues.username,
          userId: newUser.dataValues.id,
          token,
          exp,
        });
      }
    } catch (theseHands) {
      console.log("ERROR in registering");
      console.log(theseHands);
      res.sendStatus(400);
    }
  },
};
