import db from "../models/index";

const getListTransactionFee = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let ListFee = await db.LoaiGD.findAll({
        raw: true,
      }).then((err) => {
        console.log(err);
      });

      resolve({
        errCode: 0,
        errMessage: "Get list fees sucessfully!",
        listFee: ListFee,
      });
    } catch (error) {
      reject({
        errCode: 1,
        errMessage: error,
      });
    }
  });
};

module.exports = {
  getListTransactionFee,
};
