"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NguoiDung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //NguoiDung.belongsTo(models.NhomNguoiDung);
    }
  }
  NguoiDung.init(
    {
      MaNguoiDung: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      NgayDK: DataTypes.DATE,
      NgheNghiep: DataTypes.STRING,
      Email: DataTypes.STRING,
      SDT: DataTypes.STRING,
      DiaChi: DataTypes.STRING,
      CCCD: DataTypes.STRING,
      HoTen: DataTypes.STRING,
      NgaySinh: DataTypes.STRING,
      GioiTinh: DataTypes.BOOLEAN,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      MaNhom: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "NguoiDung",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return NguoiDung;
};
