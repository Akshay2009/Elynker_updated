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
      validate: {
        len: {
          args: [0, 5],
          msg: "Rating must be between 0-5 ",
        },
      },
    },
    image_path: {
      type: Sequelize.ARRAY(Sequelize.STRING),
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
