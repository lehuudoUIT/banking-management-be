import { Op, where } from "sequelize";
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

const getListAccount = async (manhom, email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let tennhom = await db.NhomNguoiDung.findOne({
        where: {
          MaNhom: manhom,
        },
        raw: true,
      })
        .then((result) => {
          return result.TenNhom;
        })
        .catch((err) => {
          console.log(err);
        });

      if (tennhom === "Customer") {
        //! Nếu người dùng là khách hàng chỉ trả về danh sách tài khoản của khách hàng
        await db.NguoiDung.findAll({
          where: {
            Email: email,
          },
          include: { model: db.TaiKhoan },
          raw: true,
          nest: true,
        })
          .then((result) => {
            if (!result || result.length == 0) {
              resolve({
                errCode: 1,
                message: "User does not have account!",
              });
            } else {
              let newResult = [];

              result.forEach((element) => {
                newResult.push(element.TaiKhoans);
              });

              resolve({
                errMessage: 0,
                message: "Get user accounts successfully!",
                accounts: newResult,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        //! Lấy toàn bộ danh sách tài khoản
        db.TaiKhoan.findAll()
          .catch((err) => {
            console.log(err);
          })
          .then((result) => {
            resolve({
              errCode: 0,
              message: "Get list accounts successfully!",
              accounts: result,
            });
          })
          .catch((err) => {
            console.log(err);
            resolve({
              errCode: 3,
              message: "Get list accounts unsuccessfully!",
              err: err,
            });
          });
      }
    } catch (error) {
      reject({
        errCode: 2,
        message: "Get list accounts unsuccessfully!",
        err: error,
      });
    }
  });
};

const getDetailAccount = async (SoTaiKhoan) => {
  return new Promise(async (resolve, reject) => {
    try {
      let account = await db.TaiKhoan.findOne({
        where: {
          SoTaiKhoan: SoTaiKhoan,
        },
        raw: true,
      });
      if (!account) {
        resolve({
          errMessage: 0,
          message: "Account does not exist!",
        });
      } else {
        resolve({
          errMessage: 0,
          message: "Get detail account successfully!",
          account: account,
        });
      }
    } catch (error) {
      reject({
        errCode: 2,
        message: "Get account failed!",
      });
    }
  });
};

const createAccount = async (MaKhachHang, LoaiTaiKhoan) => {
  return new Promise(async (resolve, reject) => {
    try {
      let plsql = `
                BEGIN
                P_THEM_TAIKHOAN (:stk, :makh, :loaitk, :sodu, :trangthai);
                END;
                `;

      const { count, rows } = await db.TaiKhoan.findAndCountAll({
        where: {
          MaKhachHang: MaKhachHang,
        },
        raw: true,
      });

      // Define prefix of account number
      let prefix = count + 1;
      prefix = prefix.toString();
      prefix += prefix;

      let user = await db.NguoiDung.findOne({
        where: {
          MaNguoiDung: MaKhachHang,
        },
        raw: true,
        attributes: ["CCCD"],
      });

      let newStk = prefix + user.CCCD;

      await db.sequelize
        .query(plsql, {
          replacements: {
            stk: newStk,
            makh: MaKhachHang,
            loaitk: LoaiTaiKhoan,
            sodu: "50000",
            trangthai: "1",
          },
        })
        .then(async () => {
          let account = await db.TaiKhoan.findOne({
            where: {
              SoTaiKhoan: newStk,
            },
            raw: true,
          });
          resolve({
            errMessage: 0,
            message: "Create account successfully!",
            account: account,
          });
        })
        .catch((err) => {
          reject({
            errMessage: 3,
            message: "Create account unsuccessfully!",
          });
        });
    } catch (error) {
      reject({
        errCode: 2,
        message: "Create account unsuccessfully!",
        errMess: error,
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
      console.log("CCCD: " + CCCD);
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

module.exports = {
  createStatement,
  getListAccount,
  getDetailAccount,
  createAccount,
  createTransaction,
};
