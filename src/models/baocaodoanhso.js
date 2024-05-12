"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BaoCaoDoanhSo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BaoCaoDoanhSo.belongsTo(models.LoaiTietKiem, {
        foreignKey: "MaLoaiTietKiem",
      });
    }
  }
  BaoCaoDoanhSo.init(
    {
      Ngay: {
        type: DataTypes.DATE,
        primaryKey: true,
      },
      MaLoaiTietKiem: {
        type: DataTypes.INTEGER,
      },
      TongThu: DataTypes.INTEGER,
      TongChi: DataTypes.INTEGER,
      ChenhLech: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "BaoCaoDoanhSo",
    }
  );
  return BaoCaoDoanhSo;
};
