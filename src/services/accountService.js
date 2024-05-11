import { Op } from "sequelize";
import db from "../models/index";

const createStatement = async (SoTaiKhoan, StartDate, EndDate) => {
  return new Promise((resolve, reject) => {
    try {
      const startDate = new Date(StartDate);
      const endDate = new Date(EndDate);
      let transactions = db.GiaoDich.findAll({
        where: {
          [Op.or]: [{ SoTKNhan: SoTaiKhoan }, { SoTKRut: SoTaiKhoan }],
          ThoiGian: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [["ThoiGian", "DESC"]],
        raw: true,
      })
        .then((result) => {
          resolve({
            errMessage: 0,
            message: "Create statement successfully!",
            transactions: result,
          });
        })
        .catch((err) => {
          reject({
            errMessage: 1,
            message: "Create statement unsuccessfully!",
            err: err,
          });
        });
    } catch (error) {
      reject({
        errMessage: 2,
        message: "Create statement unsuccessfully!",
        err: error,
      });
    }
  });
};

module.exports = {
  createStatement,
};
