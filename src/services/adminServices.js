import db from "../models/index";

const getListRole = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let listRole = await db.ChucNang.findAll({ raw: true }).catch((err) => {
        console.log(err);
      });

      return resolve({
        errCode: 0,
        message: "Get list role successfully!",
        listRole: listRole,
      });
    } catch (error) {
      reject({
        errCode: 1,
        message: "Get list role unsuccessfully!",
        error: error,
      });
    }
  });
};
const createRole = async () => {
  return new Promise((resolve, reject) => {
    try {
    } catch (error) {}
  });
};
const deleteRole = async () => {
  return new Promise((resolve, reject) => {
    try {
    } catch (error) {}
  });
};
const updateRole = async () => {
  return new Promise((resolve, reject) => {
    try {
    } catch (error) {}
  });
};
const getListGroupRole = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let listRole = await db.PhanQuyen.findAll({ raw: true }).catch((err) => {
        console.log(err);
      });

      return resolve({
        errCode: 0,
        message: "Get list authorization successfully!",
        listRole: listRole,
      });
    } catch (error) {
      reject({
        errCode: 1,
        message: "Get list authorization unsuccessfully!",
        error: error,
      });
    }
  });
};
const createGroupRole = async () => {
  return new Promise((resolve, reject) => {
    try {
    } catch (error) {}
  });
};
const deleteGroupRole = async () => {
  return new Promise((resolve, reject) => {
    try {
    } catch (error) {}
  });
};
const updateGroupRole = async () => {
  return new Promise((resolve, reject) => {
    try {
    } catch (error) {}
  });
};
const getListGroup = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let listRole = await db.NhomNguoiDung.findAll({ raw: true }).catch(
        (err) => {
          console.log(err);
        }
      );

      return resolve({
        errCode: 0,
        message: "Get list group successfully!",
        listRole: listRole,
      });
    } catch (error) {
      reject({
        errCode: 1,
        message: "Get list group unsuccessfully!",
        error: error,
      });
    }
  });
};
const createGroup = async () => {
  return new Promise((resolve, reject) => {
    try {
    } catch (error) {}
  });
};
const deleteGroup = async () => {
  return new Promise((resolve, reject) => {
    try {
    } catch (error) {}
  });
};
const updateGroup = async () => {
  return new Promise((resolve, reject) => {
    try {
    } catch (error) {}
  });
};

module.exports = {
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
};
