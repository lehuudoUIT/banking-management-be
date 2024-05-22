import db from "../models/index";

const getListRule = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let listRule = await db.ThamSo.findAll({ raw: true }).catch((err) => {
        console.log(err);
        resolve({
          errCode: 2,
          message: "Error in BE!",
          error: err,
        });
      });
      resolve({
        errCode: 0,
        message: "Get list rule successfully!",
        listRole: listRule,
      });
    } catch (error) {
      reject({
        errCode: 3,
        message: "Get list rule unsuccessfully!",
        error: error,
      });
    }
  });
};
const createRule = async (Ten, GiaTri) => {
  return new Promise(async (resolve, reject) => {
    try {
      let rule = await db.ThamSo.create({
        Ten: Ten,
        GiaTri: GiaTri,
      }).catch((err) => {
        console.log(err);
      });

      resolve({
        errCode: 0,
        message: "Create rule successfully!",
      });
    } catch (error) {
      reject({
        errCode: 2,
        message: "Create rule unsuccessfully!",
        error: error,
      });
    }
  });
};
const deleteRule = async (MaThamSo) => {
  return new Promise(async (resolve, reject) => {
    try {
      //? delete the rule
      await db.ThamSo.destroy({
        where: {
          MaThamSo: MaThamSo,
        },
      }).catch((err) => {
        resolve({
          errCode: 2,
          message: "Delete rule unsuccessfully!",
        });
      });

      resolve({
        errCode: 0,
        message: `Delete rule ${MaThamSo} successfully!`,
      });
    } catch (error) {
      reject({
        errCode: 3,
        message: "Delete rule unsuccessfully!",
        error: error,
      });
    }
  });
};

const updateRule = async (MaThamSo, GiaTri) => {
  return new Promise(async (resolve, reject) => {
    try {
      //? update role
      await db.ThamSo.update(
        {
          GiaTri: GiaTri,
        },
        {
          where: {
            MaThamSo: MaThamSo,
          },
        }
      ).catch((err) => {
        console.log(err);
        resolve({
          errCode: 0,
          message: `Update rule ${MaThamSo} unsuccessfully!`,
        });
      });
      resolve({
        errCode: 0,
        message: `Update rule ${MaThamSo} successfully!`,
      });
    } catch (error) {
      reject({
        errCode: 3,
        message: `Update rule ${MaThamSo} unsuccessfully!`,
        error: error,
      });
    }
  });
};

module.exports = {
  getListRule,
  createRule,
  deleteRule,
  updateRule,
};
