import db from "../models/index";
require("dotenv").config();
const nodemailer = require("nodemailer");

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

const sendOTP = async (otp, email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASWORD,
        },
      });

      const info = await transporter
        .sendMail({
          from: '"Ngân hàng BBank 👻" <lehuudouit@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Mã OTP xác nhận giao dịch", // Subject line
          text: "Mã OTP của bạn là...", // plain text body
          html: `Mã OTP của bạn là <b>${otp}</b>`, // html body
        })
        .then((info) => {
          resolve({
            errMessage: 0,
            message: "Send OTP sucessfully!",
          });
        })
        .catch((err) => {
          console.log(err);
          resolve({
            errMessage: 1,
            message: "Send OTP failed!",
            err: err,
          });
        });
    } catch (error) {
      reject({
        errMessage: 1,
        message: "Send OTP failed!",
        err: error,
      });
    }
  });
};

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

module.exports = {
  checkExistAccount,
  handleUserLogin,
  sendOTP,
};
