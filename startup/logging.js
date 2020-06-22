const winston = require("winston");
require('winston-mongodb');
require('express-async-errors');


module.exports = function () {
  process.on("uncaughtException", (exp) => {
    winston.error(exp.message, exp);
    process.exit(1);
  });

  process.on("unhandledRejection", (exp) => {
    winston.error(exp.message, exp);
    process.exit(1);
  });

  winston.add(new winston.transports.Console({}))
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.MongoDB({ db: "mongodb://localhost/online-courses" })
  );
};
