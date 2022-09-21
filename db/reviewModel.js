const sequelize = require("./connection.js");
const { DataTypes } = require("sequelize");

const Review = sequelize.define(
  "review",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    summary: DataTypes.TEXT,
    recommended: DataTypes.BOOLEAN,
    response: DataTypes.TEXT,
    body: DataTypes.TEXT,
    date: DataTypes.DATE,
    helpfulness: DataTypes.INTEGER,
    photos: DataTypes.ARRAY(DataTypes.JSON),
    reported: DataTypes.BOOLEAN,
    reviewer_name: DataTypes.TEXT,
    reviewer_email: DataTypes.TEXT,
  },
  {
    timestamps: false,
    // initialAutoIncrement: 5774953,
    indexes: [
      {
        fields: ["product_id"],
      },
    ],
  }
);

module.exports.ReviewModel = Review;
