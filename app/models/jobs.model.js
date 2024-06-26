module.exports = (sequelize, Sequelize) => {
  const Jobs = sequelize.define("jobs", {
    title: {
      type: Sequelize.STRING(100),
    },
    description: {
      type: Sequelize.STRING(500),
    },
    category_id: {
      type: Sequelize.STRING(500),
    },
    min_experience: {
      type: Sequelize.INTEGER,
    },
    job_location: {
      type: Sequelize.STRING(200),
    },
    salary_offered: {
      type: Sequelize.NUMERIC(10, 2),
    },
    status: {
      type: Sequelize.ENUM('active', 'fulfilled', 'deleted','hold'),
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'fulfilled', 'deleted','hold']], // Ensures only 'active', 'fulfilled', 'deleted','hold' values are accepted
      },
    },
    created_by: {
      type: Sequelize.NUMERIC,
    },
    updated_by: {
      type: Sequelize.NUMERIC,
    },
  });

  return Jobs;
};
