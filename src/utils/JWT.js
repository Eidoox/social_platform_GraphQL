const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_ACCESSTOKEN, {
    expiresIn: "1h",
  });

  return token;
};

module.exports = generateAccessToken;
