module.exports = (sequelize, Sequelize) => {
  const SubscriptionDetails = sequelize.define("subscription_details", {
       name: {
      type: Sequelize.STRING(200),
      validate: {
        len: {
          args: [0, 200],
          msg: "Length must be less than or equal to 200 characters",
        },
      },
    },
    description: {
      type: Sequelize.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: "Length must be less than or equal to 255 characters",
        },
      },
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  return SubscriptionDetails;
};
