import {
  getListStatistic,
  getListSavingRevenue,
} from "../services/dashboardServices";

const getAllStatistic = async (req, res) => {
  let response = await getListStatistic();
  return res.status(200).json(response);
};
const getAllSavingRevenueByYear = async (req, res) => {
  let response = await getListSavingRevenue();
  return res.status(200).json(response);
};
module.exports = {
  getAllStatistic,
  getAllSavingRevenueByYear,
};
