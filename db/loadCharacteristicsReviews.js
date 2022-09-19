const fs = require("fs");
const { parse } = require("csv-parse");
const { CharReviewsModel } = require("./characteristicsReviewModel.js");
const sequelize = require("./connection.js");

const createConnection = () => {
  return Promise.resolve(sequelize);
};

const load = async () => {
  await createConnection();

  const parser = fs
    .createReadStream(__dirname + "/../data/characteristic_reviews.csv")
    .pipe(
      parse({
        skip_records_with_error: true,
        columns: true,
      })
    );
  for await (const row of parser) {
    await CharReviewsModel.bulkCreate([
      {
        id: parseInt(row.id),
        characteristicId: parseInt(row.characteristic_id),
        reviewId: parseInt(row.review_id),
        value: parseInt(row.value),
      },
    ]);
  }
  console.log("Characteristics for reviews finished adding");
};

load().catch((err) => console.log(err));
