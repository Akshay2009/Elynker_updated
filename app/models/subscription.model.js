module.exports = (sequelize, Sequelize) => {
  const Subscription = sequelize.define("subscription", {
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
    duration: {
      type: Sequelize.INTEGER,
    },
    price: {
      type: Sequelize.DECIMAL,
    },
    services: {
      type: Sequelize.TEXT,
    },
    tax: {
      type: Sequelize.DECIMAL,
    },
    discount: {
      type: Sequelize.DECIMAL,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: Sequelize.NUMERIC,
    },
    updated_by: {
      type: Sequelize.NUMERIC,
    },
    subscriptionDetailId: {
      type: Sequelize.INTEGER,
      allowNull: false, // Ensure this is not nullable
      references: {
        model: "subscription_details", // Name of the referenced model
        key: "subscriptionId", // Name of the referenced column
      },
    },
  });

  return Subscription;
};
