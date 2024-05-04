"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LoaiGD extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LoaiGD.init(
    {
      MaLoaiGD: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      TenLoaiGD: DataTypes.STRING,
      Phi: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "LoaiGD",
      tableName: "LoaiGiaoDich",
      timestamps: false,
    }
  );
  return LoaiGD;
};
