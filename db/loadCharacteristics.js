const fs = require("fs");
const { parse } = require("csv-parse");
const { CharacteristicsModel } = require("./characteristicsModel.js");
const sequelize = require("./connection.js");

const createConnection = () => {
  return Promise.resolve(sequelize);
};

const load = async () => {
  await createConnection();
  await CharacteristicsModel.sync({ force: true });

  const parser = fs
    .createReadStream(__dirname + "/../data/characteristics.csv")
    .pipe(
      parse({
        skip_records_with_error: true,
        columns: true,
      })
    );
  for await (const row of parser) {
    await CharacteristicsModel.bulkCreate([
      {
        id: parseInt(row.id),
        product_id: parseInt(row.product_id),
        name: row.name,
      },
    ]);
  }
  console.log("Characteristics finished adding");
};

load().catch((err) => console.log(err));
