//UPDATE reviews SET arry_field =
// UPDATE table SET array_field = array_field || 'new item' WHERE ...

//UPDATE reviews SET photos= array_append(photos, '{id: csv.id, url: csv.url}) Where review_id=csv.reviewid

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
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
  const connection = await createConnection();

  const parser = fs
    .createReadStream(__dirname + "/../data/reviews_photos.csv")
    .pipe(
      parse({
        skip_records_with_error: true,
        columns: true,
      })
    );
  for await (const row of parser) {
    const object = JSON.stringify({
      id: parseInt(row.id),
      url: row.url,
    });
    await ReviewModel.update(
      {
        photos: connection.fn("array_append", connection.col("photos"), object),
      },
      { where: { review_id: row.review_id } }
    );
  }
  console.log("Photos finished adding to reviews table");
};

load().catch((err) => console.log(err));
