import db from "../models/index";

const createTransactionType = async (TenLoaiGD, Phi) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Hallo world");
    } catch (error) {
      console.log("Hello cc");
    }
  });
};

module.exports = {
  createTransactionType,
};
