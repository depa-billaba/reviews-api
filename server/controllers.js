const sequelize = require("./db/index.js");
const { ReviewModel } = require("../db/reviewModel");
const { CharacteristicsModel } = require("../db/characteristicsModel");
const { CharReviewsModel } = require("../db/characteristicsReviewModel");
const { QueryTypes } = require("sequelize");

const allReviews = async (req, res) => {
  let { page, count, sort, product_id } = req.query;

  page = page ? page : 0;
  count = count ? count : 5;

  let orderParams =
    sort === "newest"
      ? [["date", "DESC"]]
      : sort === "helpful"
      ? [["helpfulness", "DESC"]]
      : [
          ["date", "DESC"],
          ["helpfulness", "DESC"],
        ];

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
  }).catch((err) => res.sendStatus(500));

  let response = {
    product: product_id.toString(),
    page: page,
    count: count,
    results: reviews.rows,
  };
  res.json(response);
};

const metaData = async (req, res) => {
  const { product_id } = req.query;
  if (!product_id) res.status(404).send("Not found");
  let response = await sequelize
    .query(
      `select json_build_object(
      'product_id', ${product_id},
      'ratings', (
        with ratingsCount as (select rating, count(rating)
        from reviews where product_id=${product_id}
        group by rating
        order by rating ASC
        )
        select json_object_agg(rating, count) from ratingsCount),
        'recommended', (
          select json_build_object(
          '0', (select count(recommended) from reviews where product_id=${product_id} AND recommended= false ),
			    '1', (select count(recommended) from reviews where product_id=${product_id} AND recommended=true )
		     	)
	   	  ),
       'characteristics', (
          with chars as(select name, id from characteristics where product_id=${product_id})
          select json_object_agg(name,
		      (select json_build_object('id', chars.id, 'value', (select cast(round(avg(value),2) as varchar) from review_characteristics where "characteristicId" =chars.id)))
		  )
	     from chars
	   )
      )`,
      {
        raw: true,
        type: QueryTypes.SELECT,
      }
    )
    .catch((err) => res.sendStatus(500));

  res.json(response[0]["json_build_object"]);
};

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
  }).catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
  let review_id = reviewPost.dataValues.id;
  let previousCharRevId = await CharReviewsModel.findOne({
    order: [["id", "DESC"]],
  });
  previousCharRevId = previousCharRevId.dataValues.id + 1;
  let bulk = Object.keys(characteristics).map((id) => {
    return {
      id: previousCharRevId++,
      reviewId: review_id,
      characteristicId: parseInt(id),
      value: characteristics[id],
    };
  });
  await CharReviewsModel.bulkCreate(bulk).catch((err) => res.sendStatus(500));
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
  ).catch((err) => res.sendStatus(500));
  res.sendStatus(204);
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
  ).catch((err) => res.sendStatus(500));
  res.sendStatus(204);
};

module.exports.allReviews = allReviews;
module.exports.metaData = metaData;
module.exports.newReview = newReview;
module.exports.helpful = helpful;
module.exports.report = report;
