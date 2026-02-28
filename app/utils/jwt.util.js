const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysecretkey";

exports.generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};
