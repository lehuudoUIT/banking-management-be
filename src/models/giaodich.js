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
      GiaoDich.belongsTo(models.LoaiGD, { foreignKey: "MaLoaiGD" });
      GiaoDich.belongsTo(models.TaiKhoan, {
        foreignKey: "SoTKNhan",
        as: "TaiKhoanDich",
      });
      GiaoDich.belongsTo(models.TaiKhoan, {
        foreignKey: "SoTKRut",
        as: "TaiKhoanNguon",
      });
    }
  }
  GiaoDich.init(
    {
      MaGiaoDich: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      SoTien: DataTypes.INTEGER,
      SoDuNguon: DataTypes.INTEGER,
      SoDuDich: DataTypes.INTEGER,
      ThoiGian: DataTypes.DATE,
      NoiDung: DataTypes.TEXT,
      TongTien: DataTypes.INTEGER,
      SoTKNhan: DataTypes.STRING,
      SoTKRut: DataTypes.STRING,
      MaLoaiGD: DataTypes.INTEGER,
      MaNhanVien: DataTypes.INTEGER,
      MaPhieu: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "GiaoDich",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return GiaoDich;
};
