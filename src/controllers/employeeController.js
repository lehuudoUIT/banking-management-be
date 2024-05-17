import {
  createUser,
  createWithdrawTransaction,
  getSavingByAccountCCCD,
} from "../services/employeeService";

import {
  depositSaving,
  withdrawSaving,
  createSavingReport,
  getSavingByAccountId,
} from "../services/savingService";

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
const getAllSavingByCCCD = async (req, res) => {
  console.log(req.params);
  const { cccd, trangthai } = req.params;
  // TrangThai = 1 get active saving
  // TrangThai = 0 get unactive saving
  // else or none get all

  if (!cccd) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await getSavingByAccountCCCD(cccd, trangthai);
  return res.status(200).json(response);
};
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
const postCreateSavingReport = async (req, res) => {
  const { Ngay, isCreateReport } = req.body;
  if (!Ngay || !isCreateReport) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await createSavingReport(Ngay, isCreateReport);
  return res.status(200).json(response);
};
const postChangeRule = async (req, res) => {};

module.exports = {
  postCreateUserCIF,
  postWithdrawSavingOffline,
  getAllSavingByCCCD,
  postCreateStatement,
  postCreateSavingReport,
  postChangeRule,
  postDepositSavingOffline,
};
