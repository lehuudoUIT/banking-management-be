import {
  getAccountById,
  createTransaction,
} from "../services/customerServices";

import { depositSaving, withdrawSaving } from "../services/savingService";

const getAllAccountById = async (req, res) => {
  const MaKhachHang = req.body.MaKhachHang;
  if (!MaKhachHang) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }

  let response = await getAccountById(MaKhachHang);
  return res.status(200).json(response);
};

const postTransferAccount = async (req, res) => {
  const { SoTien, NoiDung, SoTKNhan, SoTKRut, MaLoaiGD } = req.body;

  if (!SoTien || !NoiDung || !SoTKNhan || !SoTKRut || !MaLoaiGD) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }

  let response = await createTransaction(
    SoTien,
    NoiDung,
    SoTKNhan,
    SoTKRut,
    MaLoaiGD,
    null,
    null
  );
  return res.status(200).json(response);
};

const postDepositSavingOnline = async (req, res) => {
  const { SoTienGui, PhuongThuc, MaLoaiTietKiem, MaKhachHang, SoTK } = req.body;
  if (!SoTienGui || !PhuongThuc || !MaLoaiTietKiem || !MaKhachHang || !SoTK) {
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
    SoTK,
    null
  );
  return res.status(200).json(response);
};

const postWithdrawSavingOnline = async (req, res) => {
  const { MaPhieu } = req.body;
  if (!MaPhieu) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await withdrawSaving(MaPhieu, null);
  return res.status(200).json(response);
};

module.exports = {
  getAllAccountById,
  postTransferAccount,
  postDepositSavingOnline,
  postWithdrawSavingOnline,
};
