const sequelize = require("./connection.js");
const { DataTypes } = require("sequelize");

const Characteristics = sequelize.define(
  "characteristic",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: DataTypes.INTEGER,
    name: DataTypes.TEXT,
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ["product_id"],
      },
    ],
  }
);

module.exports.CharacteristicsModel = Characteristics;
