import { Router } from "express";
import { handleLogin, postCreateUser } from "../controllers/userController";
import { getAllUser } from "../controllers/APIController";
let router = Router();

let initAPIRoutes = (app) => {
  // example login
  router.get("/users", getAllUser);
  router.post("/create-user", postCreateUser);
  console.log("Hallo");

  return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes;
