import db from "../models/index";

const createUser = async (
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
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkExist = await checkExistUser(Email, SDT, CCCD, username);
      if (checkExist.length > 0) {
        resolve({
          errCode: 3,
          message: checkExist,
        });
      } else {
        let plsql = `
          BEGIN
          P_THEM_NGUOIDUNG (:nghenghiep, :email, :sdt, :diachi, :cccd, :hoten, :ngaysinh, :gioitinh, :username, :password, :manhom);
          END;
          `;

        await db.sequelize.query(plsql, {
          replacements: {
            nghenghiep: NgheNghiep,
            email: Email,
            sdt: SDT,
            diachi: DiaChi,
            cccd: CCCD,
            hoten: HoTen,
            ngaysinh: NgaySinh,
            gioitinh: GioiTinh,
            username: username,
            password: password,
            manhom: MaNhom,
          },
        });

        resolve({
          errMessage: 0,
          message: "Create user successfully!",
        });
      }
    } catch (error) {
      reject({
        errCode: 2,
        message: "Create user failed!",
        errMess: error,
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

      await db.sequelize.query(plsql, {
        replacements: {
          stk: prefix + user.CCCD,
          makh: MaKhachHang,
          loaitk: LoaiTaiKhoan,
          sodu: "50000",
          trangthai: "1",
        },
      });

      resolve({
        errMessage: 0,
        message: "Create account successfully!",
      });
    } catch (error) {
      reject({
        errCode: 2,
        message: "Create account failed!",
        errMess: error,
      });
    }
  });
};

const isExistedCCCD = async (CCCD) => {
  let cccd = await db.NguoiDung.findOne({
    where: {
      CCCD: CCCD,
    },
    raw: true,
    attributes: ["CCCD"],
  });

  return cccd;
};

const createWithdrawTransaction = async (
  CCCD,
  SoTien,
  NoiDung,
  SoTKRut,
  MaLoaiGD,
  MaNhanVien
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isExisted = await isExistedCCCD(CCCD);
      if (!isExisted) {
        resolve({
          message: "Sender does not exist!",
          errCode: 1,
        });
      } else {
        let taiKhoanRut = await db.TaiKhoan.findOne({
          where: {
            SoTaiKhoan: SoTKRut,
          },
          raw: true,
        });
        if (!taiKhoanRut) {
          resolve({
            message: "Withdrawal account does not exist!",
            errCode: 2,
          });
        } else {
          let loaigd = await db.LoaiGD.findOne({
            where: {
              MaLoaiGD: MaLoaiGD,
            },
            raw: true,
          });

          let TongTien = SoTien + loaigd.Phi;

          taiKhoanRut.SoDu -= TongTien;
          if (taiKhoanRut.SoDu <= 50000) {
            return resolve({
              message: "Withdrawal account does not have enough money!",
              errCode: 3,
            });
          }

          await taiKhoanRut.save();

          let plsql = `
          BEGIN
          P_THEM_GIAODICH (:sotien, :sodu, :noidung, :tongtien, :sotknhan, :sotkrut, :maloaigd, :manv, :cccd);
          END;
          `;

          await db.sequelize.query(plsql, {
            replacements: {
              sotien: SoTien,
              sodu: taiKhoanRut.SoDu,
              noidung: NoiDung,
              tongtien: TongTien,
              sotknhan: null,
              stkrut: SoTKRut,
              maloaigd: MaLoaiGD,
              manv: MaNhanVien,
              cccd: CCCD,
            },
          });

          resolve({
            message: `With draw from ${SoTKRut} successfully!`,
            errCode: 0,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {
  createUser,
  createAccount,
  createWithdrawTransaction,
};
