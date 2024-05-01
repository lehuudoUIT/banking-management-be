import { createTransactionType } from "../services/adminService";

const postCreateTransactionType = async (req, res) => {
  let { TenLoaiGD, Phi } = req.body;

  if (!TenLoaiGD || !Phi) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }

  await createTransactionType(TenLoaiGD, Phi);
};

module.exports = {
  postCreateTransactionType,
};
