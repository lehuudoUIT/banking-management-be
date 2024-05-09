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
      ChucNang.hasMany(models.PhanQuyen, {
        foreignKey: "MaChucNang",
      });
    }
  }
  ChucNang.init(
    {
      MaChucNang: {
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
      freezeTableName: true,
      timestamps: false,
      name: {
        singular: "ChucNang",
        plural: "ChucNang",
      },
    }
  );
  return ChucNang;
};
