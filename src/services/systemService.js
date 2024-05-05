import db from "../models/index";

const checkExistAccount = async (SoTaiKhoan) => {
  return new Promise(async (resolve, reject) => {
    try {
      let account = await db.TaiKhoan.findOne({
        where: {
          SoTaiKhoan: SoTaiKhoan,
        },
        include: [
          {
            model: db.NguoiDung,
            required: true,
          },
        ],
        raw: true,
      })
        .then((result) => {
          return {
            SoTaiKhoan: result.SoTaiKhoan,
            HoTen: result["NguoiDung.HoTen"],
          };
        })
        .catch((err) => {
          console.log(err);
        });

      console.log(account);

      if (!account) {
        resolve({
          errMessage: 1,
          message: "Account is not existed!",
        });
      } else {
        resolve({
          errMessage: 0,
          message: "Account is existed!",
          account: account,
        });
      }
    } catch (error) {
      resolve({
        errMessage: 2,
        message: "Check account failed!",
        error: error,
      });
    }
  });
};

let handleUserLogin = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      // User already exists
      let user = await db.NguoiDung.findOne({
        where: { username: username },
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
          userData.user = user;
          userData.user.password = undefined;
        } else {
          userData.errCode = 1;
          userData.errMessage = "Wrong password!";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your username isn's exists in our system. Please try again!`;
      }

      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  checkExistAccount,
  handleUserLogin,
};
