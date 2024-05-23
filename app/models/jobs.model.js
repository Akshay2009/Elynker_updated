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
    created_by: {
      type: Sequelize.NUMERIC,
    },
    updated_by: {
      type: Sequelize.NUMERIC,
    },
  });

  return Jobs;
};
