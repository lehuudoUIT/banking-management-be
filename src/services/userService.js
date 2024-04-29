import db from "../models/index";

let checkUsername = (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { username: username },
      });
      if (user) {
        resolve(user);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};
let handleUserLogin = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let users = await checkUsername(username);
      if (users) {
        // User already exists
        let user = await db.User.findOne({
          where: { username: username },
          attributes: ["username", "password", "id"],
          raw: true,
        });
        if (user) {
          let check;
          if (user.password === password) {
            check = 1;
          } else {
            check = 0;
          }
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Login success";
            userData.user = users;
          } else {
            userData.errCode = 1;
            userData.errMessage = "Wrong password!";
          }
        } else {
          userData.errCode = 1;
          userData.errMessage = `Your username isn's exists in our system. Please try again!`;
        }
      }
      resolve(userData);
    } catch (e) {
      reject(e);
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
  handleUserLogin,
  createUser,
};
