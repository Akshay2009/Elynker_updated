module.exports = (sequelize, Sequelize) => {
  const WebComponents = sequelize.define("web_components", {
    page_name: {
      type: Sequelize.STRING(200),
    },
    page_link: {
      type: Sequelize.STRING(500),
      allowNull: true, // URL is optional
      validate: {
        isUrl: {
          msg: "Must be a valid URL",
          // Custom validator to check URL only if it's provided
          args: true,
        },
      },
    },
    created_by: {
      type: Sequelize.NUMERIC,
    },
    updated_by: {
      type: Sequelize.NUMERIC,
    },
  });

  return WebComponents;
};
