import { getListTransactionFee } from "../services/transactionService";

const getAllTransactionFee = async (req, res) => {
  let response = await getListTransactionFee();
  return res.status(200).json(response);
};

module.exports = {
  getAllTransactionFee,
};
