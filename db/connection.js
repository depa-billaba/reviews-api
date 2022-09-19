const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { Sequelize } = require("sequelize");

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

module.exports = sequelize;
