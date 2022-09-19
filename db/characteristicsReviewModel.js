const sequelize = require("./connection");
const { DataTypes } = require("sequelize");

const CharacteristicsReviews = sequelize.define(
  "review_characteristic",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reviewId: DataTypes.INTEGER,
    characteristicId: DataTypes.INTEGER,
    value: DataTypes.INTEGER,
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ["characteristicId", "reviewId"],
      },
    ],
  }
);

module.exports.CharReviewsModel = CharacteristicsReviews;
