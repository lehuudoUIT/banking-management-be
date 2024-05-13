import jwt from "jsonwebtoken";
require("dotenv").config();

const createJWT = (payload) => {
  let token = null;
  let key = process.env.JWT_SECRET;
  try {
    token = jwt.sign(payload, key);
  } catch (error) {
    console.log("🚀 ~ createJWT ~ error:", error);
  }
  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  //? Decode is token that's been decoded
  try {
    let decoded = jwt.verify(token, key);
    return decoded;
  } catch (error) {
    console.log(error);
  }
  return decoded;
};

const checkUserJWT = (req, res, next) => {
  let cookies = req.cookies;

  if (cookies && cookies.jwt) {
    let token = cookies.jwt;
    let decoded = verifyToken(token);
    console.log("🚀 ~ checkUserJWT ~ decoded:", decoded);
    if (decoded) {
      console.log("hallo");
      next();
    } else {
      return res.status(401).json({
        errCode: -1,
        message: "User is not authenticated or session expires",
      });
    }
  } else {
    return res.status(401).json({
      errCode: -2,
      message: "User is not authenticated or session expires",
    });
  }
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
};
