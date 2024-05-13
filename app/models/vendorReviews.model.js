module.exports = (sequelize, Sequelize) => {
  const vendorReviews = sequelize.define("vendor_reviews", {
    reviewer_user_id:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    review_description: {
      type: Sequelize.STRING(500),
      validate: {
        len: {
          args: [0, 500],
          msg: "review must be less than 500 characters",
        },
      },
    },
    review_star: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    image_path: {
      type: Sequelize.STRING(1000),
    },
    reviewer_name: {
      type: Sequelize.STRING(100),
    },
    reviewer_image_path: {
      type: Sequelize.STRING(100),
    },
    created_by: {
      type: Sequelize.NUMERIC,
    },
  });

  return vendorReviews;
};
