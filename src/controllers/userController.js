import {
  createUser,
  getListUser,
  getDetailUser,
  deleteUser,
  updateUser,
} from "../services/userServices";

const postCreateUserCIF = async (req, res) => {
  let {
    NgheNghiep,
    Email,
    SDT,
    DiaChi,
    CCCD,
    HoTen,
    NgaySinh,
    GioiTinh,
    username,
    password,
    MaNhom,
  } = req.body;

  if (
    !NgheNghiep ||
    !Email ||
    !SDT ||
    !DiaChi ||
    !CCCD ||
    !HoTen ||
    !NgaySinh ||
    !GioiTinh ||
    !username ||
    !password ||
    !MaNhom
  )
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });

  let response = await createUser(
    NgheNghiep,
    Email,
    SDT,
    DiaChi,
    CCCD,
    HoTen,
    NgaySinh,
    GioiTinh,
    username,
    password,
    MaNhom
  );
  return res.status(200).json(response);
};

const getAllUser = async (req, res) => {
  let response = await getListUser();
  return res.status(200).json(response);
};

const getDetailUserById = async (req, res) => {
  let id = req.params.id;
  let response = await getDetailUser(id);
  return res.status(200).json(response);
};
const postDeleteUser = async (req, res) => {
  const { MaNguoiDung } = req.body;
  if (!MaNguoiDung)
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  let response = await deleteUser(MaNguoiDung);
  return res.status(200).json(response);
};
const postUpdateUser = async (req, res) => {
  let { MaNguoiDung, NgheNghiep, Email, SDT, DiaChi, password, MaNhom } =
    req.body;

  if (!MaNguoiDung)
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });

  let response = await updateUser(
    MaNguoiDung,
    NgheNghiep,
    Email,
    SDT,
    DiaChi,
    password,
    MaNhom
  );
  return res.status(200).json(response);
};

module.exports = {
  postCreateUserCIF,
  getAllUser,
  getDetailUserById,
  postDeleteUser,
  postUpdateUser,
};
