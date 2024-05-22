import {
  depositSaving,
  withdrawSaving,
  getSavingType,
  getListSaving,
  getSavingByAccountId,
  getSavingByAccountCCCD,
  createSavingReport,
  createSavingType,
  deleteSavingType,
  updateSavingType,
} from "../services/savingService";

const getAllSaving = async (req, res) => {
  // TrangThai = 1 get active saving
  // TrangThai = 0 get unactive saving
  // else or none get all

  // Nếu là người dùng lấy toàn bộ phiếu của người dùng, nếu là emp hoặc admin lấy toàn bộ phiếu

  let { maNhom, email } = req.user;

  let response = await getListSaving(maNhom, email);
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

const getDetailSavingById = async (req, res) => {
  const { sotaikhoan } = req.params;
  // TrangThai = 1 get active saving
  // TrangThai = 0 get unactive saving
  // else or none get all
  let TrangThai = 1;
  let response = await getSavingByAccountId(sotaikhoan, TrangThai);
  return res.status(200).json(response);
};

const postDepositSaving = async (req, res) => {
  const {
    SoTaiKhoan,
    SoTienGui,
    PhuongThuc,
    MaLoaiTietKiem,
    MaKhachHang,
    MaNhanVien,
  } = req.body;
  if (!SoTienGui || !PhuongThuc || !MaLoaiTietKiem || !MaKhachHang) {
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
    SoTaiKhoan || null,
    MaNhanVien || null
  );
  return res.status(200).json(response);
};

const postWithdrawSaving = async (req, res) => {
  const { MaPhieu, MaNhanVien } = req.body;
  if (!MaPhieu) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await withdrawSaving(MaPhieu, MaNhanVien || null);
  return res.status(200).json(response);
};

const postCreateSavingReport = async (req, res) => {
  const { Ngay, isCreateReport } = req.body;
  if (!Ngay) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await createSavingReport(Ngay, isCreateReport);
  return res.status(200).json(response);
};

const getAllSavingType = async (req, res) => {
  let response = await getSavingType();
  return res.status(200).json(response);
};

const postCreateSavingType = async (req, res) => {
  const { KyHan, LaiSuat, GhiChu } = req.body;
  if (!KyHan || !LaiSuat) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await createSavingType(KyHan, LaiSuat, GhiChu);
  return res.status(200).json(response);
};
const postDeleteSavingType = async (req, res) => {
  const { MaLoaiTietKiem } = req.body;
  if (!MaLoaiTietKiem) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await deleteSavingType(MaLoaiTietKiem);
  return res.status(200).json(response);
};
const postUpdateSavingType = async (req, res) => {
  const { MaLoaiTietKiem, LaiSuat, GhiChu } = req.body;
  if (!MaLoaiTietKiem || !LaiSuat || !GhiChu) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await updateSavingType(MaLoaiTietKiem, LaiSuat, GhiChu);
  return res.status(200).json(response);
};

module.exports = {
  getAllSaving,
  getAllSavingType,
  getAllSavingByCCCD,
  getDetailSavingById,
  postDepositSaving,
  postWithdrawSaving,
  postCreateSavingReport,
  postCreateSavingType,
  postDeleteSavingType,
  postUpdateSavingType,
};
