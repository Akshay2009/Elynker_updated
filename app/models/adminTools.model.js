module.exports = (sequelize, Sequelize) => {
  const AdminTools = sequelize.define("admin_tools", {
    parent_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    title: {
      type: Sequelize.STRING(50),
      validate: {
        len: {
          args: [0, 50], // Corrected to match the message
          msg: "length must be less than or equal to 50 characters",
        },
      },
    },
    description: {
      type: Sequelize.STRING(255),
      validate: {
        len: {
          args: [0, 255], // Corrected to match the message
          msg: " length must be less than or equal to 255 characters",
        },
      },
    },
    icon_image: {
      type: Sequelize.TEXT,
    },
    cover_image: {
      type: Sequelize.TEXT,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
    },
    service_type: {
      type: Sequelize.STRING(50),
      validate: {
        len: {
          args: [0, 50], // Corrected to match the message
          msg: " length must be less than or equal to 50 characters",
        },
      },
    },
    redirect_to: {
      type: Sequelize.STRING(255),
      validate: {
        len: {
          args: [0, 255], // Corrected to match the message
          msg: " length must be less than or equal to 255 characters",
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

  return AdminTools;
};
