"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TaiKhoan", {
      SoTaiKhoan: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      MaKhachHang: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      LoaiTaiKhoan: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      SoDu: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      NgayMo: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      TrangThai: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TaiKhoan");
  },
};
