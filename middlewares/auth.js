const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  if (!config.get("requiresAuth")) return next();
  const token = req.header("x-auth-token");
  if (!token) res.status(401).send("access denied you are not authorized!");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    return next();
  } catch (error) {
    res.status(400).send("invalid token");
  }
};
