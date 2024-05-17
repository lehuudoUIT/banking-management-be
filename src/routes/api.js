import { Router } from "express";

import {
  postCreateUserCIF,
  postWithdrawSavingOffline,
  getAllSavingByCCCD,
  postCreateStatement,
  postCreateSavingReport,
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
  postDepositSavingOnline,
  postWithdrawSavingOnline,
  getAllSavingById,
  getAllTransaction,
} from "../controllers/customerController";

import { getAllSavingType } from "../controllers/savingController";

import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";

import { getAllTransactionFee } from "../controllers/transactionController";

import {
  getListAccountByRole,
  getDetailAccountById,
  postCreateUserAccount,
  postWithdrawAccount,
  postDepositAccount,
  postTransferAccount,
} from "../controllers/accountController";

let router = Router();

let initAPIRoutes = (app) => {
  // All route will go through 2 middleware
  router.all("*", checkUserJWT, checkUserPermission);

  // employee api
  // router.post("/employee/cif/create", postCreateUserCIF);
  // router.post("/employee/account/withdraw", postWithdrawAccount);
  // router.post("/employee/account/deposit", postDepositAccount);
  // router.post("/employee/saving/withdraw", postWithdrawSavingOffline);
  // router.post("/employee/saving/deposit", postDepositSavingOffline);
  // router.get("/employee/saving/get-all/:cccd/:trangthai", getAllSavingByCCCD);
  // router.post("/employee/statement/create", postCreateStatement);
  // router.post("/employee/saving/create-report", postCreateSavingReport);
  // router.post("/employee/rule/change", postChangeRule);

  // customer api
  // router.post("/customer/account/get-all", getAllAccountById);
  // router.post("/customer/account/transfer", postTransferAccount);
  // router.post("/customer/saving/deposit", postDepositSavingOnline);
  // router.post("/customer/saving/withdraw", postWithdrawSavingOnline);
  // router.post("/customer/saving/get-all", getAllSavingById);
  // router.post("/customer/transaction/get-all", getAllTransaction);

  //saving
  //router.get("/saving-type/get-all", getAllSavingType);

  //admin
  //router.post("/employee/rule/change", postChangeRule);

  //system
  // router.post("/system/account/check-exist", postCheckExistAccount);
  // router.post("/system/account/cccd-exist", postCheckExistCccd);
  router.post("/login", handleLogin);
  // router.post("/system/otp/send", handleSendOtp);
  //transaction
  //router.get("/transaction-fees", getAllTransactionFee);
  // new api
  //! ACCOUNT
  router.get("/accounts", getListAccountByRole);
  router.get("/accounts/:sotaikhoan", getDetailAccountById);
  router.post("/accounts", postCreateUserAccount);
  router.post("/accounts/deposit", postDepositAccount);
  router.post("/accounts/withdraw", postWithdrawAccount);
  router.post("/accounts/transfer", postTransferAccount);
  //! SAVING ACCOUNT
  //! TRANSACTION
  //! USER

  return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes;
