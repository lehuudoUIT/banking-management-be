import db from "../models/index";

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
          resolve({
            errMessage: 3,
            message: "Create tracsaction failed!",
            error: err,
          });
        });

      resolve({
        errMessage: 0,
        message: "Create tracsaction sucessfully!",
      });
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
  getAccountById,
  createTransaction,
};
