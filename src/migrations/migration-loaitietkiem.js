"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("LoaiTietKiem", {
      MaLoaiTietKiem: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      KyHan: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      LaiSuat: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("LoaiTietKiem");
  },
};
