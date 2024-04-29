"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("GiaoDich", {
      MaGiaoDich: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      SoTien: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      SoDu: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      ThoiGian: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      NoiDung: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      TongTien: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      SoTKNhan: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      SoTKRut: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      MaLoaiGD: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      MaNhanVien: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("GiaoDich");
  },
};
