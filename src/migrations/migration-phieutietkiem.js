"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PhieuTietKiem", {
      MaPhieu: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      NgayMo: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      SoTienGui: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      LaiSuat: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      NgayRut: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      SoTienRut: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      PhuongThuc: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      TrangThai: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      MaLoaiTietKiem: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      MaKhachHang: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      SoTK: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      MaNhanVien: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PhieuTietKiem");
  },
};
