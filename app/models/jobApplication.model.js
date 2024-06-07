module.exports = (sequelize, Sequelize) => {
    const JobApplication = sequelize.define("job_application", {
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(10),
        allowNull: false,
        validate: {
          len: {
            args: [10, 10],
            msg: 'Phone Number must be of 10 characters',
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
      status: {
        type: Sequelize.ENUM('applied', 'accepted', 'rejected'),
        defaultValue: 'applied',
        validate: {
          isIn: [['applied', 'accepted', 'rejected']], // Ensures only 'applied', 'accepted', 'rejected' values are accepted
        },
      },
      resume:{
        type: Sequelize.TEXT,
      },
      cover_letter:{
        type: Sequelize.TEXT,
      },
      created_by: {
        type: Sequelize.NUMERIC,
      },
      updated_by: {
        type: Sequelize.NUMERIC,
      },
    });
  
    return JobApplication;
  };
  