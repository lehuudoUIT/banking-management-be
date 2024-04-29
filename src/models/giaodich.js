"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GiaoDich extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GiaoDich.init(
    {
      MaGD: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      SoTien: DataTypes.BIGINT,
      SoDu: DataTypes.BIGINT,
      ThoiGian: DataTypes.DATE,
      NoiDung: DataTypes.TEXT,
      TongTien: DataTypes.BIGINT,
      SoTKNhan: DataTypes.STRING,
      SoTKRut: DataTypes.STRING,
      MaLoaiGD: DataTypes.INTEGER,
      MaNhanVien: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "GiaoDich",
    }
  );
  return GiaoDich;
};