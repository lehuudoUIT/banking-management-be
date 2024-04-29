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

module.exports = {
  createUser,
};
