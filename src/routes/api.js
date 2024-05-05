import { Router } from "express";

import {
  postCreateUserCIF,
  postCreateUserAccount,
  postWithdrawAccount,
  postDepositAccount,
  postWithdrawSaving,
  postDepositSaving,
  getAllSaving,
  postCreateStatement,
  postCreateReport,
  postChangeRule,
} from "../controllers/employeeController";

import { postCreateTransactionType } from "../controllers/adminController";
import { postCheckExistAccount } from "../controllers/systemController";

import {
  getAllAccountById,
  postTransferAccount,
} from "../controllers/customerController";

let router = Router();

let initAPIRoutes = (app) => {
  // employee api
  router.post("/employee/cif/create", postCreateUserCIF);
  router.post("/employee/account/create", postCreateUserAccount);
  router.post("/employee/account/withdraw", postWithdrawAccount);
  router.post("/employee/account/deposit", postDepositAccount);
  router.post("/employee/saving/withdraw", postWithdrawSaving);
  router.post("/employee/saving/deposit", postDepositSaving);
  router.post("/employee/saving/get-all", getAllSaving);
  router.post("/employee/statement/create", postCreateStatement);
  router.post("/employee/report/create", postCreateReport);
  router.post("/employee/rule/change", postChangeRule);

  // customer api
  router.post("/customer/account/get-all", getAllAccountById);
  router.post("/customer/account/transfer", postTransferAccount);

  //admin
  router.post("/employee/rule/change", postChangeRule);

  //system
  router.post("/system/account/check-exist", postCheckExistAccount);

  return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes;
