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
      });
    }
  });
};

// const countAccount = async (MaKhachHang) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { count, rows } = await db.TaiKhoan.findAndCountAll({
//         where: {
//           MaKhachHang: MaKhachHang,
//         },
//       });
//       console.log("Hihih");
//       resolve(count);
//     } catch (error) {
//       reject(undefined);
//     }
//   });
// };

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
      });
    }
  });
};

module.exports = {
  createUser,
  createAccount,
};
