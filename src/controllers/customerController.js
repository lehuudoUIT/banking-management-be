import {
  getAccountById,
  createTransaction,
} from "../services/customerServices";

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
  let { SoTien, NoiDung, SoTKNhan, SoTKRut, MaLoaiGD, MaNhanVien, CCCD } =
    req.body;

  if (
    !SoTien ||
    !NoiDung ||
    !SoTKNhan ||
    !SoTKRut ||
    !MaLoaiGD ||
    !MaNhanVien
  ) {
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
    MaNhanVien,
    CCCD
  );
  return res.status(200).json(response);
};

module.exports = {
  getAllAccountById,
  postTransferAccount,
};
