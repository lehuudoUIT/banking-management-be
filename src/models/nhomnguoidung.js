"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NhomNguoiDung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      NhomNguoiDung.hasMany(models.PhanQuyen, {
        foreignKey: "MaNhom",
      });
    }
  }
  NhomNguoiDung.init(
    {
      MaNhom: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      TenNhom: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "NhomNguoiDung",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return NhomNguoiDung;
};
