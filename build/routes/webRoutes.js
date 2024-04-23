"use strict";

var _express = require("express");
var _userController = require("../controllers/userController");
var router = (0, _express.Router)();
var initWebRoutes = function initWebRoutes(app) {
  // example login
  router.post("/api/login", _userController.handleLogin);
  router.post("/api/create-user", _userController.postCreateUser);
  return app.use("/", router);
};
module.exports = initWebRoutes;