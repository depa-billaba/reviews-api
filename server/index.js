const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const {
  allReviews,
  metaData,
  newReview,
  helpful,
  report,
} = require("./controllers");
const express = require("express");
const app = express();
const { queryParser } = require("express-query-parser");

app.use(
  express.static(__dirname + "/loaderio-05104211795493e37fb782faecca5751.txt")
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  })
);

app.get("/reviews", allReviews);
app.get("/reviews/meta", metaData);
app.post("/reviews", newReview);
app.put("/reviews/:reviewId/helpful", helpful);
app.put("/reviews/:reviewId/report", report);

const server = app.listen(process.env.PORT, () => {
  console.log(`server has started on port: ${process.env.PORT}`);
});
server.keepAliveTimeout = 49 * 1000;
