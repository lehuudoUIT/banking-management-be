import jwt from "jsonwebtoken";
require("dotenv").config();

const createJWT = (payload) => {
  let token = null;
  let key = process.env.JWT_SECRET;
  try {
    token = jwt.sign(payload, key);
    console.log("🚀 ~ createJWT ~ token:", token);
  } catch (error) {
    console.log("🚀 ~ createJWT ~ error:", error);
  }
  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let data = null;
  //? Decode is token that's been decoded
  return jwt.verify(token, key, function (err, decoded) {
    if (err) {
      console.log("🚀 ~ err:", err);
      return data;
      /*
            err = {
              name: 'JsonWebTokenError',
              message: 'jwt malformed'
            }
          */
    }
    return decoded;
  });
};

module.exports = {
  createJWT,
  verifyToken,
};
