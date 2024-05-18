import {
  getListAccount,
  getDetailAccount,
  createAccount,
  createTransaction,
} from "../services/accountService";

const getListAccountByRole = async (req, res) => {
  let { maNhom, email } = req.user;

  let response = await getListAccount(maNhom, email);
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

const getDetailAccountById = async (req, res) => {
  let sotaikhoan = req.params.sotaikhoan;
  let response = await getDetailAccount(sotaikhoan);
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

module.exports = {
  getListAccountByRole,
  getDetailAccountById,
  postCreateUserAccount,
  postWithdrawAccount,
  postDepositAccount,
  postTransferAccount,
};
