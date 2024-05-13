import {
  checkExistAccount,
  handleUserLogin,
  sendOTP,
  checkExistCccd,
} from "../services/systemService";

const postCheckExistAccount = async (req, res) => {
  const SoTaiKhoan = req.body.SoTaiKhoan;
  if (!SoTaiKhoan)
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });

  //Create transaction with STK nguoi nhan la null

  let response = await checkExistAccount(SoTaiKhoan);
  return res.status(200).json(response);
};

let handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await handleUserLogin(username, password);

  //res.cookie = ("test cookies", { samesite: "None", httpOnly: true });

  res.cookie("jwt", response.data.access_token, {
    httpOnly: true,
    maxAge: process.env.JWT_EXPIRES_IN,
  });
  return res.status(200).json(response);
};

const handleSendOtp = async (req, res) => {
  const { otp, email } = req.body;
  if (!otp || !email) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await sendOTP(otp, email);
  return res.status(200).json(response);
};

const postCheckExistCccd = async (req, res) => {
  const { CCCD } = req.body;
  if (!CCCD) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await checkExistCccd(CCCD);
  return res.status(200).json(response);
};

module.exports = {
  postCheckExistAccount,
  handleLogin,
  handleSendOtp,
  postCheckExistCccd,
};
