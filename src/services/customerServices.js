import { Op } from "sequelize";
import db from "../models/index";
import moment from "moment";

const getAccountById = async (MaKhachHang) => {
  return new Promise(async (resolve, reject) => {
    try {
      let accounts = await db.TaiKhoan.findAll({
        where: {
          MaKhachHang: MaKhachHang,
        },
      });

      resolve({
        errMessage: 0,
        message: "Get list account successfully!",
        accounts: accounts,
      });
    } catch (error) {
      reject({
        errCode: 2,
        message: "Get list account failed!",
      });
    }
  });
};

const createTransaction = async (
  SoTien,
  NoiDung,
  SoTKNhan,
  SoTKRut,
  MaLoaiGD,
  MaNhanVien,
  CCCD
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = {
        errMessage: 0,
        message: "Create tracsaction sucessfully!",
      };

      let plsql = `
      BEGIN
      P_THEM_GIAODICH (:sotien , :noidung, :sotknhan, :sotkrut, :maloaigd, :manv, :cccd);
      END;
      `;
      await db.sequelize
        .query(plsql, {
          replacements: {
            sotien: SoTien,
            noidung: NoiDung,
            sotknhan: SoTKNhan,
            sotkrut: SoTKRut,
            maloaigd: MaLoaiGD,
            manv: MaNhanVien,
            cccd: CCCD,
          },
        })
        .catch((err) => {
          response = {
            errMessage: 3,
            message: "Create tracsaction failed!",
            error: err,
          };
          resolve(response);
        });
      if (response.errMessage != 3) {
        let transaction = await db.GiaoDich.findOne({
          where: {
            SoTKNhan: SoTKNhan,
            SoTKRut: SoTKRut,
          },
          order: [["ThoiGian", "DESC"]],
          include: { model: db.LoaiGD },
        })
          .then((item) => {
            response = {
              errMessage: 0,
              message: "Create tracsaction sucessfully!",
              transaction: item,
            };
          })
          .catch((err) => {
            response = {
              errMessage: 4,
              message: "Create report failed!",
              error: err,
            };
          });
      }
      resolve(response);
    } catch (error) {
      reject({
        errCode: 2,
        message: "Create transaction failed!",
        error: error,
      });
    }
  });
};

const getSavingByAccountId = async (SoTaiKhoan, TrangThai) => {
  return new Promise((resolve, reject) => {
    try {
      let condition = {
        SoTK: SoTaiKhoan,
        TrangThai: TrangThai,
      };
      Object.keys(condition).forEach((key) => {
        if (!condition[key]) delete condition[key];
      });
      let savings = db.PhieuTietKiem.findAll({
        where: condition,
        raw: true,
      })
        .then((item) => {
          console.log(item);
          resolve({
            errMessage: 0,
            message: "Get savings sucessfully!",
            transaction: item,
          });
        })
        .catch((err) => {
          resolve({
            errMessage: 1,
            message: "Get savings failed!",
            error: err,
          });
        });
    } catch (error) {
      resolve({
        errMessage: 2,
        message: "Get savings failed!",
        error: error,
      });
    }
  });
};

const getListTransactionByAccountId = (SoTaiKhoan, Ngay) => {
  return new Promise((resolve, reject) => {
    try {
      let transactions = db.GiaoDich.findAll({
        where: {
          ThoiGian: {
            [Op.gte]: moment().subtract(Ngay, "days").toDate(),
          },
          [Op.or]: [{ SoTKNhan: SoTaiKhoan }, { SoTKRut: SoTaiKhoan }],
        },
        raw: true,
      })
        .then((item) => {
          console.log(item);
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
      resolve({
        errMessage: 2,
        message: "Get transactions failed!",
        error: error,
      });
    }
  });
};

module.exports = {
  getAccountById,
  createTransaction,
  getSavingByAccountId,
  getListTransactionByAccountId,
};
