"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PhieuTietKiem", {
      MaPhieu: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      NgayMo: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      SoTienGui: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      LaiSuat: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      NgayRut: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      SoTienRut: {
        allowNull: true,
        type: Sequelize.INTEGER,
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
        allowNull: true,
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
