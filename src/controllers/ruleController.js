import {
  getListRule,
  createRule,
  deleteRule,
  updateRule,
} from "../services/ruleServices";
const getAllRule = async (req, res) => {
  let response = await getListRule();
  return res.status(200).json(response);
};
const postCreateRule = async (req, res) => {
  const { Ten, GiaTri } = req.body;
  if (!Ten || !GiaTri) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await createRule(Ten, GiaTri);
  return res.status(200).json(response);
};
const postDeleteRule = async (req, res) => {
  const { MaThamSo } = req.body;
  if (!MaThamSo) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await deleteRule(MaThamSo);
  return res.status(200).json(response);
};
const postUpdateRule = async (req, res) => {
  const { MaThamSo, GiaTri } = req.body;
  if (!MaThamSo || !GiaTri) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await updateRule(MaThamSo, GiaTri);
  return res.status(200).json(response);
};
module.exports = {
  getAllRule,
  postCreateRule,
  postDeleteRule,
  postUpdateRule,
};
