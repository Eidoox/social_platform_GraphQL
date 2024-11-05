const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_ACCESSTOKEN, {
    expiresIn: "15m",
  });

  return token;
};

module.exports = generateAccessToken;
