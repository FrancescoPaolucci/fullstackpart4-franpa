const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  const saltRounds = 10;
  console.log("PASSWORD:", body.password);
  if (body.password.length <= 2) {
    response.status(400).json({
      error: "Password must be at least 3 length char",
    });
  } else if (body.username.length <= 2) {
    response.status(400).json({
      error: "Username must be at least 3 length char",
    });
  } else {
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });
    try {
      const savedUser = await user.save();
      response.json(savedUser);
    } catch (error) {
      response.status(400).json(error);
    }
  }
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");

  response.json(users);
});

module.exports = usersRouter;
