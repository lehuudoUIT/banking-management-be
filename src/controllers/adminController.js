import {
  getListRole,
  createRole,
  deleteRole,
  updateRole,
  getListGroupRole,
  createGroupRole,
  deleteGroupRole,
  updateGroupRole,
  getListGroup,
  createGroup,
  deleteGroup,
  updateGroup,
} from "../services/adminServices";

const getAllRole = async (req, res) => {
  let response = await getListRole();
  return res.status(200).json(response);
};
const postCreateRole = async (req, res) => {
  const { TenChucNang, Url, NhomNguoiDung } = req.body;
  if (!TenChucNang || !Url) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await createRole(TenChucNang, Url, NhomNguoiDung);
  return res.status(200).json(response);
};
const postDeleteRole = async (req, res) => {
  const { MaChucNang } = req.body;
  if (!MaChucNang) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await deleteRole(MaChucNang);
  return res.status(200).json(response);
};
const postUpdateRole = async (req, res) => {};
const getAllGroupRole = async (req, res) => {
  let response = await getListGroupRole();
  return res.status(200).json(response);
};
const postCreateGroupRole = async (req, res) => {
  const { MaNhom, MaChucNang } = req.body;
  if (!MaNhom || !MaChucNang) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await createGroupRole(MaNhom, MaChucNang);
  return res.status(200).json(response);
};
const postDeleteGroupRole = async (req, res) => {
  const { MaPhanQuyen } = req.body;
  if (!MaPhanQuyen) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await deleteGroupRole(MaPhanQuyen);
  return res.status(200).json(response);
};
const postUpdateGroupRole = async (req, res) => {};
const getAllGroup = async (req, res) => {
  let response = await getListGroup();
  return res.status(200).json(response);
};
const postCreateGroup = async (req, res) => {
  const { TenNhom } = req.body;
  if (!TenNhom) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await createGroup(TenNhom);
  return res.status(200).json(response);
};
const postDeleteGroup = async (req, res) => {
  const { MaNhom } = req.body;
  if (!MaNhom) {
    return res.status(500).json({
      message: "Missing input parameters",
      errCode: 1,
    });
  }
  let response = await deleteGroup(MaNhom);
  return res.status(200).json(response);
};
const postUpdateGroup = async (req, res) => {};

module.exports = {
  getAllRole,
  postCreateRole,
  postDeleteRole,
  postUpdateRole,
  getAllGroupRole,
  postCreateGroupRole,
  postDeleteGroupRole,
  postUpdateGroupRole,
  getAllGroup,
  postCreateGroup,
  postDeleteGroup,
  postUpdateGroup,
};
