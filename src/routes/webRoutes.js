import { Router } from "express";
import { handleLogin, postCreateUser } from "../controllers/userController";
let router = Router();

let initWebRoutes = (app) => {
  // example login
  router.post("/api/login", handleLogin);
  router.post("/api/create-user", postCreateUser);

  return app.use("/", router);
};

module.exports = initWebRoutes;
