module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('roles', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(50),
      unique: true,
      allowNull: false,
    },
    permissions: {
      type: Sequelize.STRING(500),
    },
    created_by: {
      type: Sequelize.NUMERIC,
    },
    updated_by: {
      type: Sequelize.NUMERIC,
    },
  }, {
    indexes: [
      {
        fields: ['name'], // Add index on the name field
      },
    ],
  });

  return Role;
};
