import db from "../models/index";
require("dotenv").config();
const nodemailer = require("nodemailer");

import { getGroupWithRoles } from "./JWTservice";
import { createJWT } from "../middleware/JWTAction";

let handleUserLogin = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      userData.data = {};

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
      // ? let token =
      //! create token
      let groupWithRoles = await getGroupWithRoles(user);
      let payload = {
        email: user.Email,
        groupWithRoles,
        maNhom: user.MaNhom,
        expiresIn: process.env.JWT_EXPIRESIN_IN,
      };

      let token = createJWT(payload);

      userData.data.roles = groupWithRoles;
      userData.data.access_token = token;

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

module.exports = {
  handleUserLogin,
  sendOTP,
};
