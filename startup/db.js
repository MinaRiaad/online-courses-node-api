const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");
require("./logging");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => winston.info(`Connected to database...`));
};
