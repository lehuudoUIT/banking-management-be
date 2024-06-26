import { Op } from "sequelize";
import db from "../models/index";
import moment from "moment";

const getListTransactionFee = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let ListFee = await db.LoaiGD.findAll({
        raw: true,
      }).catch((err) => {
        console.log(err);
      });

      resolve({
        errCode: 0,
        errMessage: "Get list fees sucessfully!",
        listFee: ListFee,
      });
    } catch (error) {
      reject({
        errCode: 1,
        errMessage: error,
      });
    }
  });
};

const getListTransactionByAccountId = (
  SoTaiKhoan,
  recent,
  startDate,
  endDate
) => {
  return new Promise((resolve, reject) => {
    try {
      let ThoiGian = {};
      if (recent) {
        console.log(recent);
        if (recent > 30) recent = 30;
        ThoiGian = {
          [Op.gte]: moment().subtract(recent, "days").toDate(),
        };
      } else {
        startDate = new Date(startDate);
        endDate = new Date(endDate).setHours(23, 59, 59);

        console.log(startDate);
        console.log(endDate);

        ThoiGian = {
          [Op.between]: [startDate, endDate],
        };
      }
      let transactions = db.GiaoDich.findAll({
        where: {
          ThoiGian: ThoiGian,
          [Op.or]: [{ SoTKNhan: SoTaiKhoan }, { SoTKRut: SoTaiKhoan }],
        },
        include: [
          {
            model: db.TaiKhoan,
            as: "TaiKhoanNguon",
            include: { model: db.NguoiDung, attributes: ["HoTen"] },
            attributes: ["SoTaiKhoan"],
          },
          {
            model: db.TaiKhoan,
            as: "TaiKhoanDich",
            include: { model: db.NguoiDung, attributes: ["HoTen"] },
            attributes: ["SoTaiKhoan"],
          },
        ],
        nest: true,
        raw: true,
      })
        .then((item) => {
          console.log("Length records: " + item.length);
          resolve({
            errMessage: 0,
            message: "Get transactions sucessfully!",
            transactions: item,
          });
        })
        .catch((err) => {
          resolve({
            errMessage: 1,
            message: "Get transactions failed!",
            error: err,
          });
        });
    } catch (error) {
      reject({
        errMessage: 2,
        message: "Get transactions failed!",
        error: error,
      });
    }
  });
};

module.exports = {
  getListTransactionFee,
  getListTransactionByAccountId,
};
