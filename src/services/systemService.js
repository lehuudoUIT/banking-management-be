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

module.exports = {
  checkExistAccount,
};
