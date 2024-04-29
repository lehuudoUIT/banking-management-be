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
      // define association here
      // NhomNguoiDung.hasMany(models.NguoiDung);
      // NhomNguoiDung.belongsToMany(models.ChucNang, {
      //   through: "PhanQuyen",
      // });
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
    }
  );
  return NhomNguoiDung;
};
