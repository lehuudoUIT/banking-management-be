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
        type: Sequelize.BIGINT,
      },
      TongChi: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      ChenhLech: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BaoCaoDoanhSo");
  },
};
