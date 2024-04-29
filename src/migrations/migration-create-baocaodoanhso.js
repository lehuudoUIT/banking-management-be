"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BaoCaoDoanhSo", {
      Ngay: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DATE,
      },
      MaLoaiTietKiem: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      TongThu: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      TongChi: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      ChenhLech: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BaoCaoDoanhSo");
  },
};
