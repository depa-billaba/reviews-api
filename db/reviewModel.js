const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 1000000,
      idle: 200000,
    },
  }
);

const Review = sequelize.define(
  "review",
  {
    review_id: {
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
    indexes: [
      {
        fields: ["product_id"],
      },
    ],
  }
);

module.exports.ReviewModel = Review;
