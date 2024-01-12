module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    // id: {
    //   type: Sequelize.NUMERIC,
    //   primaryKey: true
    // },
    email: {
      type: Sequelize.STRING(100)
    },
    name: {
      type: Sequelize.STRING(50)
    },
    mobile_number: {
      type: Sequelize.STRING(10),
      unique: true, // This makes the 'mobile_number' field unique
      allowNull: false,
    },
    created_by: {
      type: Sequelize.NUMERIC
    },
    updated_by: {
      type: Sequelize.NUMERIC
    }
  });

  return User;
};
