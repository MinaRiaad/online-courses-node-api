const Joi = require("@hapi/joi");
// Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { number } = require("@hapi/joi");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true,
      minlength: 2,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    points:{
      type:Number,
      min:1,
      required:true
    },
    media:[ {
      type: String,
    }],
    categories:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Category'
    }],
    registeredUsers:[{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User'
    }],
    finishers:[{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User'
    }]
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(2).max(255).required(),
    categories:Joi.objectId().required(),
    points: Joi.number().min(1).required(),
  });
  return schema.validate(course);
}

exports.Course = Course;
exports.validate = validateCourse;
