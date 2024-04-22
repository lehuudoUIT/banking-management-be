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
      TongThu: DataTypes.BIGINT,
      TongChi: DataTypes.BIGINT,
      ChenhLech: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "BaoCaoDoanhSo",
    }
  );
  return BaoCaoDoanhSo;
};
