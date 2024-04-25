"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("NhomNguoiDung", {
      MaNhom: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      TenNhom: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("NhomNguoiDung");
  },
};
