const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const es = require("event-stream");
const fs = require("fs");
const { parse } = require("csv-parse");
const { ReviewModel } = require("./reviewModel.js");
const { Sequelize } = require("sequelize");

const createConnection = () => {
  return new Promise((resolve, reject) => {
    const sequelize = new Sequelize(
      process.env.DATABASE,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: "localhost",
        dialect: "postgres",
        logging: false,
        pool: {
          max: 3,
          min: 0,
          acquire: 60000,
          idle: 10000,
        },
      }
    );
    resolve(sequelize);
  });
};

const load = async () => {
  await createConnection();
  await ReviewModel.sync({ force: true });

  const parser = fs.createReadStream(__dirname + "/../data/reviews.csv").pipe(
    parse({
      skip_records_with_error: true,
      columns: true,
    })
  );
  for await (const row of parser) {
    await ReviewModel.bulkCreate([
      {
        review_id: parseInt(row.id),
        product_id: parseInt(row.product_id),
        rating: parseInt(row.rating),
        summary: row.summary,
        recommended: row.recommended === "true" ? true : false,
        response: row.response !== "null" ? row.response : null,
        body: row.body,
        date: new Date(parseInt(row.date))
          .toLocaleDateString("sv")
          .replace(/\//g, "-"),
        helpfulness: parseInt(row.helpfulness),
        photos: [],
        reported: row.reported === "true" ? true : false,
        reviewer_name: row.reviewer_name,
        reviewer_email: row.reviewer_email,
      },
    ]);
  }
  console.log("Reviews finished adding");
};

load().catch((err) => console.log(err));
