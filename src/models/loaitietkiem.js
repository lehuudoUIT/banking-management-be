"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LoaiTietKiem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LoaiTietKiem.init(
    {
      MaLoaiTietKiem: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      KyHan: DataTypes.INTEGER,
      LaiSuat: DataTypes.FLOAT,
      GhiChu: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "LoaiTietKiem",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return LoaiTietKiem;
};
