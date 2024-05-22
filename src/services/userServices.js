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

        await db.sequelize
          .query(plsql, {
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
          })
          .catch((err) => {
            resolve({
              errMessage: 4,
              message: "Create user failer!",
              err: err,
            });
          });

        resolve({
          errMessage: 0,
          message: "Create user successfully!",
          user: {
            NgheNghiep: NgheNghiep,
            Email: Email,
            SDT: SDT,
            DiaChi: DiaChi,
            CCCD: CCCD,
            HoTen: HoTen,
            NgaySinh: NgaySinh,
            GioiTinh: GioiTinh,
            username: username,
            MaNhom: MaNhom,
          },
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

const checkExistUser = async (Email, SDT, CCCD, username) => {
  let message = [];
  let email = await db.NguoiDung.findOne({
    where: {
      Email: Email,
    },
    raw: true,
  });
  if (email) message.push("Email has already existed !");
  let sdt = await db.NguoiDung.findOne({
    where: {
      SDT: SDT,
    },
    raw: true,
  });

  if (sdt) message.push("SDT has already existed !");

  let cccd = await db.NguoiDung.findOne({
    where: {
      CCCD: CCCD,
    },
    raw: true,
  });

  if (cccd) message.push("CCCD has already existed !");

  let user = await db.NguoiDung.findOne({
    where: {
      username: username,
    },
    raw: true,
  });

  if (user) message.push("username has already existed !");
  return message;
};

const getListUser = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let listUser = await db.NguoiDung.findAll({ raw: true }).catch((err) => {
        console.log(err);
      });

      resolve({
        errCode: 0,
        message: `Get list user successfully!`,
        listUser: listUser,
      });
    } catch (error) {
      reject({
        errCode: 1,
        message: `Get list user unsuccessfully!`,
        error: error,
      });
    }
  });
};
const getDetailUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.NguoiDung.findOne({
        where: { MaNguoiDung: id },
        raw: true,
      }).catch((err) => {
        console.log(err);
      });

      if (!user)
        return resolve({
          errCode: 0,
          message: `User does not exist!`,
        });

      resolve({
        errCode: 0,
        message: `Get detail data of user successfully!`,
        user: user,
      });
    } catch (error) {
      reject({
        errCode: 0,
        message: `Get detail data of user unsuccessfully!`,
      });
    }
  });
};
const deleteUser = async (MaNguoiDung) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.NguoiDung.destroy({
        where: {
          MaNguoiDung: MaNguoiDung,
        },
      }).catch((err) => {
        console.log(err);
      });

      resolve({
        errCode: 0,
        message: `Delete user (id: ${MaNguoiDung}) successfully!`,
      });
    } catch (error) {
      reject({
        errCode: 0,
        message: `Delete user unsuccessfully!`,
        error: error,
      });
    }
  });
};
const updateUser = async (
  MaNguoiDung,
  NgheNghiep,
  Email,
  SDT,
  DiaChi,
  password,
  MaNhom
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.NguoiDung.update(
        {
          NgheNghiep: NgheNghiep || undefined,
          Email: Email || undefined,
          SDT: SDT || undefined,
          DiaChi: DiaChi || undefined,
          password: password || undefined,
          MaNhom: MaNhom || undefined,
        },
        {
          where: {
            MaNguoiDung: MaNguoiDung,
          },
        }
      ).catch((err) => {
        console.log(err);
        return resolve({
          errCode: 3,
          message: `Update user (id: ${MaNguoiDung}) unsuccessfully!`,
        });
      });

      resolve({
        errCode: 0,
        message: `Update user (id: ${MaNguoiDung}) successfully!`,
      });
    } catch (error) {
      reject({
        errCode: 0,
        message: `Update user unsuccessfully!`,
        error: error,
      });
    }
  });
};

module.exports = {
  createUser,
  getListUser,
  getDetailUser,
  deleteUser,
  updateUser,
};
