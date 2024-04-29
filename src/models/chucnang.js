"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChucNang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChucNang.belongsToMany(models.NhomNguoiDung, {
        through: "PhanQuyen",
      });
    }
  }
  ChucNang.init(
    {
      MaNhom: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      TenChucNang: DataTypes.STRING,
      Url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ChucNang",
    }
  );
  return ChucNang;
};
