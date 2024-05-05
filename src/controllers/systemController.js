import { checkExistAccount, handleUserLogin } from "../services/systemService";

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
  return res.status(200).json(response);
};

module.exports = {
  postCheckExistAccount,
  handleLogin,
};
