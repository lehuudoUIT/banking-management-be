"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PhieuTietKiem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PhieuTietKiem.belongsTo(models.LoaiTietKiem, {
        foreignKey: "MaLoaiTietKiem",
      });
    }
  }
  PhieuTietKiem.init(
    {
      MaPhieu: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      NgayMo: DataTypes.DATE,
      SoTienGui: DataTypes.INTEGER,
      LaiSuat: DataTypes.FLOAT,
      NgayRut: DataTypes.DATE,
      SoTienRut: DataTypes.INTEGER,
      PhuongThuc: DataTypes.STRING,
      TrangThai: DataTypes.BOOLEAN,
      MaLoaiTietKiem: DataTypes.INTEGER,
      MaKhachHang: DataTypes.INTEGER,
      SoTK: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PhieuTietKiem",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return PhieuTietKiem;
};
