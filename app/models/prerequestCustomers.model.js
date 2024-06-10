module.exports = (sequelize, Sequelize) => {
  const PrerequestCustomers = sequelize.define("prerequest_customers", {
    name: {
      type: Sequelize.STRING(50),
      validate: {
        len: {
          args: [3, 50],
          msg: "Length must be greater than 2 characters and less than 50 characters",
        },
      },
    },
    email: {
      type: Sequelize.STRING(200),
      validate: {
        isEmail: {
          msg: "Invalid email format",
        },
      },
    },
    mobile_number: {
      type: Sequelize.STRING(10),
      validate: {
        len: {
          args: [10, 10],
          msg: "Mobile Number must be of 10 characters",
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

  return PrerequestCustomers;
};
