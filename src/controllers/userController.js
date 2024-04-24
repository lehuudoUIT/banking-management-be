import { handleUserLogin, createUser } from "../services/userService";
// example login
let handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let userData = await handleUserLogin(username, password);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData : {},
  });
};

const postCreateUser = async (req, res) => {
  let data = req.body;
  await createUser(data);
  res.status(200).json();
};

module.exports = {
  handleLogin,
  postCreateUser,
};
