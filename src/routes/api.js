import { Router } from "express";

import { handleLogin, handleSendOtp } from "../controllers/systemController";

import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";

import {
  getAllTransactionFee,
  getAllTransaction,
} from "../controllers/transactionController";

import {
  getListAccountByRole,
  getDetailAccountById,
  postCreateUserAccount,
  postWithdrawAccount,
  postDepositAccount,
  postTransferAccount,
  postCreateStatement,
  postCheckExistAccount,
  postCheckExistCccd,
} from "../controllers/accountController";

import {
  getAllSaving,
  getAllSavingByCCCD,
  getDetailSavingById,
  postDepositSaving,
  postWithdrawSaving,
  getAllSavingType,
  postCreateSavingReport,
} from "../controllers/savingController";

import { postCreateUserCIF } from "../controllers/userController";

import {
  getAllRole,
  postCreateRole,
  postDeleteRole,
  postUpdateRole,
  getAllGroupRole,
  postCreateGroupRole,
  postDeleteGroupRole,
  postUpdateGroupRole,
  getAllGroup,
  postCreateGroup,
  postDeleteGroup,
  postUpdateGroup,
} from "../controllers/adminController";

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

  //admin
  //router.post("/employee/rule/change", postChangeRule);

  //system
  // router.post("/system/account/check-exist", postCheckExistAccount);
  // router.post("/system/account/cccd-exist", postCheckExistCccd);
  router.post("/login", handleLogin);
  // router.post("/system/otp/send", handleSendOtp);
  //transaction
  // new api
  //! ACCOUNT
  router.get("/accounts", getListAccountByRole);
  router.get("/accounts/detail/:sotaikhoan", getDetailAccountById);
  router.post("/accounts/create", postCreateUserAccount);
  router.post("/accounts/deposit", postDepositAccount);
  router.post("/accounts/withdraw", postWithdrawAccount);
  router.post("/accounts/transfer", postTransferAccount);
  router.post("/accounts/statement", postCreateStatement);
  router.get("/accounts/check-exist/:sotaikhoan", postCheckExistAccount);
  router.get("/accounts/cccd-exist/:cccd", postCheckExistCccd);

  //! SAVING ACCOUNT
  router.get("/saving-accounts", getAllSaving);
  router.get("/saving-accounts/detail/:sotaikhoan", getDetailSavingById);
  router.get("/saving-accounts/:cccd/:trangthai", getAllSavingByCCCD);
  router.post("/saving-accounts/deposit", postDepositSaving);
  router.post("/saving-accounts/withdraw", postWithdrawSaving);
  router.post("/saving-accounts/report", postCreateSavingReport);
  router.get("/saving-type/get-all", getAllSavingType);

  //! TRANSACTION
  router.post("/transaction/get-all", getAllTransaction);
  router.get("/transaction-fees", getAllTransactionFee);

  //! USER
  router.post("/user/create", postCreateUserCIF);

  //! ADMIN
  router.get("/role/get-all", getAllRole);
  router.post("/role/create", postCreateRole);
  router.post("/role/delete", postDeleteRole);
  router.post("/role/update", postUpdateRole);
  router.get("/group-role/get-all", getAllGroupRole);
  router.post("/group-role/create", postCreateGroupRole);
  router.post("/group-role/delete", postDeleteGroupRole);
  router.post("/group-role/update", postUpdateGroupRole);
  router.get("/group/get-all", getAllGroup);
  router.post("/group/create", postCreateGroup);
  router.post("/group/delete", postDeleteGroup);
  router.post("/group/update", postUpdateGroup);

  return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes;
