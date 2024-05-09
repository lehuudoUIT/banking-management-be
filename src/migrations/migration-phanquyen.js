"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PhanQuyen", {
      MaPhanQuyen: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      MaNhom: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      MaChucNang: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PhanQuyen");
  },
};
