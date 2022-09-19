const fs = require("fs");
const { parse } = require("csv-parse");
const { ReviewModel } = require("./reviewModel.js");
const sequelize = require("./connection.js");

const createConnection = () => {
  return Promise.resolve(sequelize);
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
        id: parseInt(row.id),
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

module.exports = createConnection;
