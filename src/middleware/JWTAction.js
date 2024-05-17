import jwt from "jsonwebtoken";
require("dotenv").config();

const nonSecurePaths = ["/", "/register", "/login"];
// if (nonSecurePaths.includes(req.path)) return next();

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
  if (nonSecurePaths.includes(req.path)) return next();
  let cookies = req.cookies;
  if (cookies && cookies.jwt) {
    let token = cookies.jwt;
    let decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
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

const checkUserPermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();
  if (req.user) {
    let email = req.user.email;
    let roles = req.user.groupWithRoles;
    let currentUrl = req.path;

    console.log(req.method);

    console.log(roles);
    if (!roles || roles.length === 0) {
      console.log("Qua hải quan thất pại");

      return res.status(403).json({
        errCode: -3,
        message: "User do not have permission to access this URL",
      });
    }
    let canAccess = false;
    roles.forEach((element) => {
      if (currentUrl.includes(element)) canAccess = true;
    });

    if (canAccess) {
      console.log("Qua hải quan thành công");
      next();
    } else {
      console.log("Qua hải quan thất pại");

      return res.status(403).json({
        errCode: -3,
        message: "User do not have permission to access this URL",
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
  checkUserPermission,
};
