const jwt = require("jsonwebtoken");
const userModel = require("../models/UserModel");

const getCurrentUserContext = async (req) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return { user: null };
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESSTOKEN);
    const user = await userModel.findById(decoded.id);

    return { user };
  } catch (error) {
    return { user: null };
  }
};

module.exports = getCurrentUserContext;
