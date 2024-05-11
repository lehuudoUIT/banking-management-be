import { Router } from "express";

import {
  postCreateUserCIF,
  postCreateUserAccount,
  postWithdrawAccount,
  postDepositAccount,
  postWithdrawSavingOffline,
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
  postCheckExistCccd,
} from "../controllers/systemController";

import {
  getAllAccountById,
  postTransferAccount,
  postDepositSavingOnline,
  postWithdrawSavingOnline,
  getAllSavingById,
} from "../controllers/customerController";

import { getAllSavingType } from "../controllers/savingController";

let router = Router();

let initAPIRoutes = (app) => {
  // employee api
  router.post("/employee/cif/create", postCreateUserCIF);
  router.post("/employee/account/create", postCreateUserAccount);
  router.post("/employee/account/withdraw", postWithdrawAccount);
  router.post("/employee/account/deposit", postDepositAccount);
  router.post("/employee/saving/withdraw", postWithdrawSavingOffline);
  router.post("/employee/saving/deposit", postDepositSavingOffline);
  router.post("/employee/saving/get-all", getAllSaving);
  router.post("/employee/statement/create", postCreateStatement);
  router.post("/employee/report/create", postCreateReport);
  router.post("/employee/rule/change", postChangeRule);

  // customer api
  router.post("/customer/account/get-all", getAllAccountById);
  router.post("/customer/account/transfer", postTransferAccount);
  router.post("/customer/account/get-all", getAllAccountById);
  router.post("/customer/saving/deposit", postDepositSavingOnline);
  router.post("/customer/saving/withdraw", postWithdrawSavingOnline);
  router.post("/customer/saving/get-all", getAllSavingById);

  //saving
  router.get("/saving-type/get-all", getAllSavingType);

  //admin
  router.post("/employee/rule/change", postChangeRule);

  //system
  router.post("/system/account/check-exist", postCheckExistAccount);
  router.post("/system/account/cccd-exist", postCheckExistCccd);
  router.post("/login", handleLogin);
  router.post("/system/otp/send", handleSendOtp);

  return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes;
