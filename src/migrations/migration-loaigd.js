"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("LoaiGiaoDich", {
      MaLoaiGD: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      TenLoaiGD: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      Phi: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("LoaiGiaoDich");
  },
};
