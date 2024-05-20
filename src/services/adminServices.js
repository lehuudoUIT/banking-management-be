import db from "../models/index";

const getListRole = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let listRole = await db.ChucNang.findAll({ raw: true }).catch((err) => {
        console.log(err);
        resolve({
          errCode: 2,
          message: "Error in BE!",
          error: err,
        });
      });
      resolve({
        errCode: 0,
        message: "Get list role successfully!",
        listRole: listRole,
      });
    } catch (error) {
      reject({
        errCode: 3,
        message: "Get list role unsuccessfully!",
        error: error,
      });
    }
  });
};
const createRole = async (TenChucNang, Url, NhomNguoiDung) => {
  return new Promise(async (resolve, reject) => {
    try {
      let chucNang = await db.ChucNang.create({
        TenChucNang: TenChucNang,
        Url: Url,
      }).catch((err) => {
        console.log(err);
      });

      let maChucNang = chucNang.MaChucNang;

      for (let group of NhomNguoiDung) {
        await createGroupRole(group, maChucNang);
      }

      resolve({
        errCode: 0,
        message: "Create role successfully!",
      });
    } catch (error) {
      reject({
        errCode: 2,
        message: "Create role unsuccessfully!",
        error: error,
      });
    }
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

      resolve({
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
const createGroupRole = async (MaNhom, MaChucNang) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.PhanQuyen.create({
        MaNhom: MaNhom,
        MaChucNang: MaChucNang,
      }).catch((err) => {
        console.log(err);
      });

      resolve({
        errCode: 0,
        message: "Create authorization successfully!",
      });
    } catch (error) {
      reject({
        errCode: 2,
        message: "Create authorization unsuccessfully!",
        error: error,
      });
    }
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

      resolve({
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
const createGroup = async (TenNhom) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.NhomNguoiDung.create({
        TenNhom: TenNhom,
      }).catch((err) => {
        console.log(err);
      });

      resolve({
        errCode: 0,
        message: "Create group successfully!",
      });
    } catch (error) {
      reject({
        errCode: 2,
        message: "Create group unsuccessfully!",
        error: error,
      });
    }
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
