const express = require("express");
const router = express.Router();
const { Course, validate } = require("../models/course");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validateObjectId = require("../middlewares/validateObjectId");
const media = require("../middlewares/validateMedia");
const { upload, deleteFiles } = require("../utils/storage");
const { getFilesNames } = require("../utils/getFilesNames");

router.get("/", async (req, res) => {
  const courses = await Course.find()
    .populate("categories", ["_id", "name"])
    .select("-__v")
    .sort("name");
  res.send(courses);
});

router.get("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const course = await Course.findById(req.params.id).populate("categories", [
    "_id",
    "name",
  ]);
  res.send(course);
});

router.post(
  "/",
  [auth, admin, upload.array("media"), media],
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let course = await Course.findOne({ name: req.body.name });
    if (course)
      return res.status(400).send("course with this name is already exist !");
    const files = getFilesNames(req.files);
    course = new Course({ ...req.body, media: files });
    await course.save();
    res.send(course);
  }
);

router.post("/:id/register", [auth, validateObjectId], async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return res.status(400).send("the course with provided ID is not found");
  course.registeredUsers.push(req.user._id);
  await course.save();
  res.send(course);
});

router.post("/:id/finish", [auth, validateObjectId], async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return res.status(400).send("the course with provided ID is not found");
  course.finishers.push(req.user._id);
  await course.save();
  res.send(course);
});

router.post("/:id/cancel", [auth, validateObjectId], async (req, res) => {
  let course = await Course.findById(req.params.id);
  if (!course)
    return res.status(400).send("the course with provided ID is not found");
  course.registeredUsers.pull({ _id: req.user._id });
  await course.save();
  res.send(course);
});

router.put(
  "/:id",
  [auth, admin, validateObjectId, upload.array("media"), media],
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.send(error.details[0].message);
    let course=await Course.findById(req.params.id);
    if (!course)
      return res.status(400).send("The course with given ID is not found");
    deleteFiles(course.media);
    const files = getFilesNames(req.files);
    course = await Course.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body, media: files },
      { useFindAndModify: false }
    );
    res.send(course);
  }
);

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const course = await Course.findOneAndRemove(
    { _id: req.params.id },
    { useFindAndModify: false }
  );
  if (!course)
    return res.status(400).send("The course with given ID is not found");
  deleteFiles(course.media);
  res.send(course);
});

router.put(
  "/:id/categories",
  [auth, admin, validateObjectId],
  async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(400).send("the course with provided ID is not found");
    course.categories = req.categories;
    await course.save();
    res.send(course);
  }
);

module.exports = router;
