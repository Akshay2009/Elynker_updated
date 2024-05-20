module.exports = (sequelize, Sequelize) => {
  const Widgets = sequelize.define("widgets", {
    widget_name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    page_name: {
      type: Sequelize.STRING(50),
    },
    is_active: {
      type: Sequelize.BOOLEAN,
    },
    rank: {
      type: Sequelize.NUMERIC,
      validate: {
        min: 1,
      },
    },
    updated_by: {
      type: Sequelize.NUMERIC,
    },
    widget_type: {
      type: Sequelize.ENUM("page", "tiles", "cards"),
      defaultValue: "page", // Default value should be one of the ENUM options
      validate: {
        isIn: [["page", "tiles", "cards"]],
      },
    },
    widget_color: {
      type: Sequelize.ENUM("blue", "grey"),
      defaultValue: "blue", // Set a default value if needed
      validate: {
        isIn: [["blue", "grey"]],
      },
    },
  });

  return Widgets;
};
