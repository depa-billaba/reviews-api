const { ReviewModel } = require("./reviewModel");
const { CharacteristicsModel } = require("./characteristicsModel");
const { CharReviewsModel } = require("./characteristicsReviewModel");

module.exports = createAssociations = () => {
  //one review has many characteristics
  ReviewModel.hasMany(CharReviewsModel, {
    foreignKey: { name: "review_id", allowNull: false },
  });
  CharReviewsModel.belongsTo(ReviewModel);

  //one characteristic can belong to many characteristic reviews
  CharacteristicsModel.hasMany(CharReviewsModel, {
    foreignKey: { name: "char_id", allowNull: false },
  });
  CharReviewsModel.belongsTo(CharacteristicsModel);
};
