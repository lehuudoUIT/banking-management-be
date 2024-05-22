"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PhanQuyen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PhanQuyen.belongsTo(models.NhomNguoiDung, {
        foreignKey: "MaNhom",
        targetKey: "MaNhom",
      });
      PhanQuyen.belongsTo(models.ChucNang, {
        foreignKey: "MaChucNang",
        targetKey: "MaChucNang",
      });
    }
  }
  PhanQuyen.init(
    {
      MaPhanQuyen: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      MaChucNang: {
        type: DataTypes.INTEGER,
      },
      MaNhom: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "PhanQuyen",
      freezeTableName: true,
      timestamps: false,
      name: {
        singular: "PhanQuyen",
        plural: "PhanQuyen",
      },
    }
  );
  return PhanQuyen;
};
