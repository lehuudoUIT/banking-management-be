import {
  createUser,
  createAccount,
  createWithdrawTransaction,
} from "../services/employeeService";

import { createTransaction } from "../services/customerServices";

import { depositSaving, withdrawSaving } from "../services/savingService";

import { createStatement } from "../services/accountService";

const postCreateUserCIF = async (req, res) => {
  let {
    NgheNghiep,
    Email,
    SDT,
    DiaChi,
    CCCD,
    HoTen,
    NgaySinh,
    GioiTinh,
    username,
    password,
    MaNhom,
  } = req.body;

  if (
    !NgheNghiep ||
    !Email ||
    !SDT ||
    !DiaChi ||
    !CCCD ||
    !HoTen ||
    !NgaySinh ||
    !GioiTinh ||
    !username ||
    !password ||
    !MaNhom
  )
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });

  let response = await createUser(
    NgheNghiep,
    Email,
    SDT,
    DiaChi,
    CCCD,
    HoTen,
    NgaySinh,
    GioiTinh,
    username,
    password,
    MaNhom
  );
  return res.status(200).json(response);
};
const postCreateUserAccount = async (req, res) => {
  let { MaKhachHang, LoaiTaiKhoan } = req.body;

  if (!MaKhachHang || !LoaiTaiKhoan)
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });

  let response = await createAccount(MaKhachHang, LoaiTaiKhoan);
  return res.status(200).json(response);
};

const postWithdrawAccount = async (req, res) => {
  const { CCCD, SoTien, NoiDung, SoTKRut, MaLoaiGD, MaNhanVien } = req.body;
  if ((!CCCD || !SoTien || !NoiDung, !SoTKRut, !MaLoaiGD, !MaNhanVien))
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });

  //Create transaction with STK nguoi nhan la null

  let response = await createTransaction(
    SoTien,
    NoiDung,
    null,
    SoTKRut,
    MaLoaiGD,
    MaNhanVien,
    CCCD
  );

  return res.status(200).json(response);
};
const postDepositAccount = async (req, res) => {
  const { CCCD, SoTien, NoiDung, SoTKNhan, MaLoaiGD, MaNhanVien } = req.body;
  if ((!CCCD || !SoTien || !NoiDung, !SoTKNhan, !MaLoaiGD, !MaNhanVien))
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });

  //Create transaction with STK nguoi nhan la null

  let response = await createTransaction(
    SoTien,
    NoiDung,
    SoTKNhan,
    null,
    MaLoaiGD,
    MaNhanVien,
    CCCD
  );

  return res.status(200).json(response);
};
const postWithdrawSavingOffline = async (req, res) => {
  const { MaPhieu, MaNhanVien } = req.body;
  if (!MaPhieu || !MaNhanVien) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await withdrawSaving(MaPhieu, MaNhanVien);
  return res.status(200).json(response);
};

const postDepositSavingOffline = async (req, res) => {
  const {
    SoTaiKhoan,
    SoTienGui,
    PhuongThuc,
    MaLoaiTietKiem,
    MaKhachHang,
    MaNhanVien,
  } = req.body;
  if (
    !SoTienGui ||
    !PhuongThuc ||
    !MaLoaiTietKiem ||
    !MaKhachHang ||
    !MaNhanVien
  ) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await depositSaving(
    SoTienGui,
    PhuongThuc,
    MaLoaiTietKiem,
    MaKhachHang,
    SoTaiKhoan,
    MaNhanVien
  );
  return res.status(200).json(response);
};
const getAllSaving = async (req, res) => {};
const postCreateStatement = async (req, res) => {
  const { SoTaiKhoan, StartDate, EndDate } = req.body;
  if (!SoTaiKhoan || !StartDate || !EndDate) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await createStatement(SoTaiKhoan, StartDate, EndDate);
  return res.status(200).json(response);
};
const postCreateReport = async (req, res) => {};
const postChangeRule = async (req, res) => {};

module.exports = {
  postCreateUserCIF,
  postCreateUserAccount,
  postWithdrawAccount,
  postDepositAccount,
  postWithdrawSavingOffline,
  getAllSaving,
  postCreateStatement,
  postCreateReport,
  postChangeRule,
  postDepositSavingOffline,
};
