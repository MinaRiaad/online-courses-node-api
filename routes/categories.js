const validateObjectId = require("../middlewares/validateObjectId");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { validate, Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find().select("-__v -createdAt -updatedAt").sort("name");
  res.send(categories);
});

router.get("/:id", [auth, admin], async (req, res) => {
  const category = await Category.findById(req.params.id).select("-__v").sort("name");
  res.send(category);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let category = new Category({ name: req.body.name });
  category = await category.save();

  res.send(category);
});

router.put("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!category)
    return res.status(404).send("The category with the given ID was not found.");

  res.send(category);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);
  if (!category)
    return res.status(404).send("The category with the given ID was not found.");

  res.send(category);
});

router.get("/:id",[auth, admin, validateObjectId], async (req, res) => {
  const category = await Category.findById(req.params.id).select("-__v");

  if (!category)
    return res.status(404).send("The category with the given ID was not found.");

  res.send(category);
});

module.exports = router;
