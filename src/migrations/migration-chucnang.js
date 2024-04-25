"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ChucNang", {
      MaChucNang: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      TenChucNang: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      Url: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ChucNang");
  },
};
