const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 50,
      min: 0,
      acquire: 1000000,
      idle: 200000,
    },
  }
);

module.exports = sequelize;

// const { Pool } = require("pg");

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: "localhost",
//   database: process.env.DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// module.exports = pool;
