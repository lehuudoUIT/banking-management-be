import {
  getListTransactionFee,
  getListTransactionByAccountId,
} from "../services/transactionService";

const getAllTransactionFee = async (req, res) => {
  let response = await getListTransactionFee();
  return res.status(200).json(response);
};

const getAllTransaction = async (req, res) => {
  let { SoTaiKhoan, recent, startDate, endDate } = req.body;
  if (!SoTaiKhoan) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await getListTransactionByAccountId(
    SoTaiKhoan,
    recent,
    startDate,
    endDate
  );
  return res.status(200).json(response);
};

module.exports = {
  getAllTransactionFee,
  getAllTransaction,
};
