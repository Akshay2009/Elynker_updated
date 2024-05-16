module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    email: {
      type: Sequelize.STRING(200),
      unique: true, // This makes the 'email' field unique
      validate: {
        isEmail: {
          msg: 'Invalid email format',
        },
        len: {
          args: [5, 200],
          msg: 'User Email length must be between 5 to 200 characters',
        },
      },
    },
    name: {
      type: Sequelize.STRING(50),
      validate: {
        len: {
          args: [3, 50],
          msg: 'User Name length must be between 3 to 50 characters',
        },
      },
    },
    city: {
      type: Sequelize.STRING(50),
      validate: {
        len: {
          args: [3, 50],
          msg: 'User City length must be between 3 to 50 characters',
        },
      },
    },
    country_code: {
      type: Sequelize.STRING(5),
      validate: {
        len: {
          args: [3, 5],
          msg: 'User Country Code length must be between 3 to 5 characters',
        },
      },
    },
    mobile_number: {
      type: Sequelize.STRING(10),
      unique: true, // This makes the 'mobile_number' field unique
      allowNull: false,
      validate: {
        len: {
          args: [10, 10],
          msg: 'User Mobile Number must be of 10 characters',
        },
      },
    },
    username: {
      type: Sequelize.STRING(50),
      unique: true, // This makes the 'username' field unique
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
  }, {
    indexes: [
      {
        fields: ['mobile_number'], // Add index on the mobile_number field
      },
      {
        fields: ['email'], // Add index on the email field
      },
      {
        fields: ['username'], // Add index on the username field
      },
    ],
  });

  return User;
};
