// const { pool } = require("./db/index.js");
const sequelize = require("./db/index.js");
const { ReviewModel } = require("../db/reviewModel");
const { CharacteristicsModel } = require("../db/characteristicsModel");
const { CharReviewsModel } = require("../db/characteristicsReviewModel");

const allReviews = async (req, res) => {
  let { page, count, sort, product_id } = req.query;

  page = page ? page : 0;
  count = count ? count : 5;

  // let orderParams = sort === 'newest' ? ['id', 'DESC']
  // : sort === 'helpful' ? ['helpfulness', 'DESC']
  // : sort === 'relevant' ?

  let reviews = await ReviewModel.findAndCountAll({
    limit: count,
    offset: count * page,
    attributes: [
      ["id", "review_id"],
      "rating",
      "summary",
      ["recommended", "recommend"],
      "response",
      "body",
      "date",
      "reviewer_name",
      "helpfulness",
      "photos",
    ],
    where: {
      product_id: parseInt(product_id),
      reported: false,
    },
    order: orderParams,
  });

  console.log(reviews);
  let response = {
    product: product_id,
    page: page,
    count: count,
    results: reviews.rows,
  };
  res.json(response);
};

const metaData = async (req, res) => {};

const newReview = async (req, res) => {
  const {
    product_id,
    rating,
    summary,
    body,
    recommend,
    name,
    email,
    photos,
    characteristics,
  } = req.body;

  let previousId = await ReviewModel.findOne({
    order: [["id", "DESC"]],
  });
  previousId = previousId.dataValues.id;
  let reviewPost = await ReviewModel.create({
    id: previousId + 1,
    product_id: product_id,
    rating: rating,
    summary: summary,
    recommended: recommend,
    response: null,
    body: body,
    date: new Date().toLocaleDateString("sv").replace(/\//g, "-"),
    photos: photos,
    reviewer_name: name,
    reviewer_email: email,
  });
  let review_id = reviewPost.dataValues.id;
  let previousCharRevId = await CharReviewsModel.findOne({
    order: [["id", "DESC"]],
  });
  previousCharRevId = previousCharRevId.dataValues.id;
  for (let id in characteristics) {
    previousCharRevId++;
    let charPost = await CharReviewsModel.create({
      id: previousCharRevId,
      reviewId: review_id,
      characteristicId: parseInt(id),
      value: characteristics[id],
    });
  }
  res.sendStatus(201);
};

const helpful = async (req, res) => {
  let update = await ReviewModel.increment(
    { helpfulness: 1 },
    {
      where: {
        id: req.params.reviewId,
      },
    }
  );
  res.send("Marked as helpful");
};

const report = async (req, res) => {
  let update = await ReviewModel.update(
    {
      reported: true,
    },
    {
      where: {
        id: req.params.reviewId,
      },
    }
  );
  res.send("Reported");
};

module.exports.allReviews = allReviews;
module.exports.metaData = metaData;
module.exports.newReview = newReview;
module.exports.helpful = helpful;
module.exports.report = report;
