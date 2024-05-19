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
const postCreateRole = async (req, res) => {};
const postDeleteRole = async (req, res) => {};
const postUpdateRole = async (req, res) => {};
const getAllGroupRole = async (req, res) => {
  let response = await getListGroupRole();
  return res.status(200).json(response);
};
const postCreateGroupRole = async (req, res) => {};
const postDeleteGroupRole = async (req, res) => {};
const postUpdateGroupRole = async (req, res) => {};
const getAllGroup = async (req, res) => {
  let response = await getListGroup();
  return res.status(200).json(response);
};
const postCreateGroup = async (req, res) => {};
const postDeleteGroup = async (req, res) => {};
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
