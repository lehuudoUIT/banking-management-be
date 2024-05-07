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
  postDepositSavingOffline,
} from "../controllers/employeeController";

import { postCreateTransactionType } from "../controllers/adminController";
import {
  postCheckExistAccount,
  handleLogin,
  handleSendOtp,
} from "../controllers/systemController";

import {
  getAllAccountById,
  postTransferAccount,
  postDepositSavingOnline,
} from "../controllers/customerController";

let router = Router();

let initAPIRoutes = (app) => {
  // employee api
  router.post("/employee/cif/create", postCreateUserCIF);
  router.post("/employee/account/create", postCreateUserAccount);
  router.post("/employee/account/withdraw", postWithdrawAccount);
  router.post("/employee/account/deposit", postDepositAccount);
  router.post("/employee/saving/withdraw", postWithdrawSaving);
  router.post("/employee/saving/get-all", getAllSaving);
  router.post("/employee/statement/create", postCreateStatement);
  router.post("/employee/report/create", postCreateReport);
  router.post("/employee/rule/change", postChangeRule);
  router.post("/employee/saving/deposit", postDepositSavingOffline);

  // customer api
  router.post("/customer/account/get-all", getAllAccountById);
  router.post("/customer/account/transfer", postTransferAccount);
  router.post("/customer/saving/deposit", postDepositSavingOnline);

  //admin
  router.post("/employee/rule/change", postChangeRule);

  //system
  router.post("/system/account/check-exist", postCheckExistAccount);
  router.post("/login", handleLogin);
  router.post("/system/otp/send", handleSendOtp);

  return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes;
