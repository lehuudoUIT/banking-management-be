import { getSavingType } from "../services/savingService";

const getAllSavingType = async (req, res) => {
  let response = await getSavingType();
  return res.status(200).json(response);
};

module.exports = {
  getAllSavingType,
};
