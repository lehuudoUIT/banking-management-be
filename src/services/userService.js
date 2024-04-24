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

const createUser = async (data) => {
  let {
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
    MaNhom,
  } = data;

  try {
    // const user = await db.NguoiDung.create({
    //   NgayDK: new Date().,
    //   NgheNghiep: NgheNghiep,
    //   Email: Email,
    //   SDT: SDT,
    //   DiaChi: DiaChi,
    //   CCCD: CCCD,
    //   HoTen: HoTen,
    //   NgaySinh: new Date().toISOString(),
    //   GioiTinh: GioiTinh,
    //   username: username,
    //   password: password,
    //   MaNhom: MaNhom,
    // });

    // const user = await db.NguoiDung.create({
    //   NgayDK: new Date().toString(),
    //   NgheNghiep: "BacSi",
    //   Email: "letoanlatao@gmail.com",
    //   SDT: "0123456",
    //   DiaChi: "HCM",
    //   CCCD: "12563987",
    //   HoTen: "Le Toan",
    //   NgaySinh: new Date().toString(),
    //   GioiTinh: 1,
    //   username: "taolaletoan",
    //   password: "123456",
    //   MaNhom: 1,
    // });

    let plsql = `
    BEGIN
    P_THEM_NGUOIDUNG (:nghenghiep, :email, :sdt, :diachi, :cccd, :hoten, :ngaysinh, :gioitinh, :username, :password, :manhom);
    END;
    `;

    let user = await db.sequelize.query(plsql, {
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

    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleUserLogin,
  createUser,
};
