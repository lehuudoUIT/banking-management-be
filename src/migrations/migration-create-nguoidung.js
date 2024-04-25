"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("NguoiDung", {
      MaNguoiDung: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      NgayDK: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      NgheNghiep: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      Email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      SDT: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      DiaChi: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      CCCD: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      HoTen: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      NgaySinh: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      GioiTinh: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      MaNhom: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("NguoiDung");
  },
};
