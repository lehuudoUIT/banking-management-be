"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ThamSo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ThamSo.init(
    {
      MaThamSo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Ten: DataTypes.STRING,
      GiaTri: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ThamSo",
    }
  );
  return ThamSo;
};
