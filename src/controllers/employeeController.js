import {
  createUser,
  createAccount,
  createWithdrawTransaction,
} from "../services/employeeService";

import { createTransaction } from "../services/customerServices";

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
const postWithdrawSaving = async (req, res) => {};
const postDepositSaving = async (req, res) => {};
const getAllSaving = async (req, res) => {};
const postCreateStatement = async (req, res) => {};
const postCreateReport = async (req, res) => {};
const postChangeRule = async (req, res) => {};

module.exports = {
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
};
