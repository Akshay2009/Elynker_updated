module.exports = (sequelize, Sequelize) => {
  const Enquiry = sequelize.define('enquiries', {
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [3, 50],
          msg: 'User Name length must be between 3 to 50 characters',
        },
      },
    },
    email: {
      type: Sequelize.STRING(200),
      validate: {
        isEmail: {
          msg: 'Invalid email format',
        },
      },
    },
    phone_number: {
      type: Sequelize.STRING(10),
      allowNull: false,
      validate: {
        len: {
          args: [10, 10],
          msg: 'Mobile Number must be of 10 characters',
        },
      },
    },
    comments: {
      type: Sequelize.STRING(500),
    },
    status: {
      type: Sequelize.ENUM('pending', 'contacted', 'closed'),
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'contacted', 'closed']], // Ensures only 'pending' or 'contacted' or 'closed values are accepted
      },
    },
    user_comment: {
      type: Sequelize.STRING(500),
    },
    type: {
      type: Sequelize.ENUM('generic', 'service', 'tools'),
      defaultValue: 'generic',
      validate: {
        isIn: [['generic', 'service', 'tools']], // Ensures only 'generic', 'service', 'tools' values are accepted
      },
    },
    type_id: {
      type: Sequelize.INTEGER,
    },
    created_by: {
      type: Sequelize.NUMERIC,
    },
    updated_by: {
      type: Sequelize.NUMERIC,
    },
  });

  return Enquiry;
};
