const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const auth = require("../middlewares/auth");
const validateObjectId = require("../middlewares/validateObjectId");
const admin = require("../middlewares/admin");


router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find({ _id: {$ne:req.user._id}}).select("-__v -password").sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("this email already registered");
  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user = await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .json(_.pick(user, ["_id", "name", "email", "avatar"]));
});

router.post("/admin", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("this email already registered");

  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.isAdmin=true;
  user = await user.save();
  res.send('New admin created successfully')
});

router.put("/:id", [auth,admin,validateObjectId], async (req, res) => {
    const user = await User.findById(req.params.id).select(
      "-password -__v"
    );
    if (!user)
      return res.status(400).send("the account with given ID is not found!");
    user.disabled=!user.disabled;
    await user.save();
    res.send("done");
});

router.post("/points", [auth], async (req, res) => {
  let user = await User.findById(req.user._id);
  if (!user)
    return res.status(400).send("the account with given ID is not found!");
  user.points+=req.body.points;
  await user.save();
  res.send("done");
});


module.exports = router;
