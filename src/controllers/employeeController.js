import { createUser } from "../services/employeeService";

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
const postCreateUserAccount = async (req, res) => {};
const postWithdrawAccount = async (req, res) => {};
const postDepositAccount = async (req, res) => {};
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
