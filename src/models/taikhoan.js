"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TaiKhoan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TaiKhoan.init(
    {
      SoTaiKhoan: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      MaKhachHang: DataTypes.STRING,
      LoaiTaiKhoan: DataTypes.STRING,
      SoDu: DataTypes.BIGINT,
      NgayMo: DataTypes.DATE,
      TrangThai: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "TaiKhoan",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return TaiKhoan;
};
