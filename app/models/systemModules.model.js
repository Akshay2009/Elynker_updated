module.exports = (sequelize, Sequelize) => {
  const SystemModules = sequelize.define("system_modules", {
    module_name: {
      type: Sequelize.STRING(100),
      validate: {
        len: {
          args: [0, 100],
          msg: "Module Name must be less than 100 characters",
          allowNull: false,
        },
      },
    },
    is_active: {
      type: Sequelize.BOOLEAN,
    },
    updated_by: {
      type: Sequelize.NUMERIC,
    },
    created_by: {
      type: Sequelize.NUMERIC,
    },
  });

  return SystemModules;
};
