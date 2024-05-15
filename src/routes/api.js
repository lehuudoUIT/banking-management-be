import { Router } from "express";

import {
  postCreateUserCIF,
  postCreateUserAccount,
  postWithdrawAccount,
  postDepositAccount,
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
  postTransferAccount,
  postDepositSavingOnline,
  postWithdrawSavingOnline,
  getAllSavingById,
  getAllTransaction,
} from "../controllers/customerController";

import { getAllSavingType } from "../controllers/savingController";

import { checkUserJWT } from "../middleware/JWTAction";

import { getAllTransactionFee } from "../controllers/transactionController";

// const checkUserLogin = (req, res, next) => {
//   const nonSecurePaths = ["/", "/register", "/login"];
//   if (nonSecurePaths.includes(req.path)) return next();

//   //authenticate user
//   if (user) {
//     next();
//   } else {
//   }
// };

let router = Router();

let initAPIRoutes = (app) => {
  // employee api
  router.post("/employee/cif/create", postCreateUserCIF);
  router.post("/employee/account/create", postCreateUserAccount);
  router.post("/employee/account/withdraw", postWithdrawAccount);
  router.post("/employee/account/deposit", postDepositAccount);
  router.post("/employee/saving/withdraw", postWithdrawSavingOffline);
  router.post("/employee/saving/deposit", postDepositSavingOffline);
  router.get("/employee/saving/get-all/:cccd/:trangthai", getAllSavingByCCCD);
  router.post("/employee/statement/create", postCreateStatement);
  router.post("/employee/saving/create-report", postCreateSavingReport);
  router.post("/employee/rule/change", postChangeRule);

  // customer api
  router.post("/customer/account/get-all", checkUserJWT, getAllAccountById);
  router.post("/customer/account/transfer", postTransferAccount);
  router.post("/customer/saving/deposit", postDepositSavingOnline);
  router.post("/customer/saving/withdraw", postWithdrawSavingOnline);
  router.post("/customer/saving/get-all", getAllSavingById);
  router.post("/customer/transaction/get-all", getAllTransaction);

  //saving
  router.get("/saving-type/get-all", getAllSavingType);

  //admin
  router.post("/employee/rule/change", postChangeRule);

  //system
  router.post("/system/account/check-exist", postCheckExistAccount);
  router.post("/system/account/cccd-exist", postCheckExistCccd);
  router.post("/login", handleLogin);
  router.post("/system/otp/send", handleSendOtp);
  //transaction
  router.get("/transaction-fees", getAllTransactionFee);

  return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes;
