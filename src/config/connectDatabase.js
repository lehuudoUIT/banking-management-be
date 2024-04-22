const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("bankdbtest", "C##BANK1", "123456", {
  host: "localhost",
  dialect: "oracle",
  port: "1522",
});

let connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connectDatabase;
