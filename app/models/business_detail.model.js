module.exports = (sequelize, Sequelize) => {
  const BusinessDetail = sequelize.define("business_detail", {
    company_name: {
      type: Sequelize.STRING(50),
    },
    document: {
      type: Sequelize.STRING(200),
    },
    upload_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    is_active: {
      type: Sequelize.INTEGER,
    },
    document_name: {
      type: Sequelize.STRING(100),
    },
    document_number: {
      type: Sequelize.STRING(100),
    },
    file_name: {
      type: Sequelize.STRING(100),
    },
    file_location: {
      type: Sequelize.STRING(200),
    },
  });

  return BusinessDetail;
};