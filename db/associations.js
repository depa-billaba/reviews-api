const { ReviewModel } = require("./reviewModel");
const { CharacteristicsModel } = require("./characteristicsModel");
const { CharReviewsModel } = require("./characteristicsReviewModel");
const sequelize = require("./connection");

module.exports = createAssociations = async () => {
  //one review has many characteristics
  ReviewModel.hasMany(CharReviewsModel, {
    foreignKey: { allowNull: false },
  });
  CharReviewsModel.belongsTo(ReviewModel);

  //one characteristic can belong to many characteristic reviews
  CharacteristicsModel.hasMany(CharReviewsModel, {
    foreignKey: { allowNull: false },
  });
  CharReviewsModel.belongsTo(CharacteristicsModel);
  await sequelize.sync({ force: true });
  sequelize.close();
};

createAssociations();
