"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PhanQuyen", {
      MaChucNang: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      MaChucNang: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PhanQuyen");
  },
};
