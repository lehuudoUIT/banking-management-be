import { checkExistAccount } from "../services/systemService";

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

module.exports = {
  postCheckExistAccount,
};
