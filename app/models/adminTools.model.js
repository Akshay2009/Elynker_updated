module.exports = (sequelize, Sequelize) => {
  const AdminTools = sequelize.define("admin_tools", {
    tools_title: {
      type: Sequelize.STRING(50),
      validate: {
        len: {
          args: [0, 50], // Corrected to match the message
          msg: "Banner Name length must be less than or equal to 50 characters",
        },
      },
    },
    tools_icon_image: {
      type: Sequelize.STRING,
    },
    tools_cover_image: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
    },
    created_by: {
      type: Sequelize.NUMERIC,
    },
    updated_by: {
      type: Sequelize.NUMERIC,
    },
  });

  return AdminTools;
};
