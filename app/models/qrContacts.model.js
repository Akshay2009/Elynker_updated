module.exports = (sequelize, Sequelize) => {
    const QrContacts = sequelize.define("qr_contacts", {
      mobile_number: {
        type: Sequelize.STRING(10),
        validate: {
          len: {
            args: [10, 10],
            msg: "Mobile Number must be of 10 characters",
          },
        },
      },
      vendor_id: {
        type: Sequelize.INTEGER,
      },
      created_by: {
        type: Sequelize.NUMERIC,
      },
      updated_by: {
        type: Sequelize.NUMERIC,
      },
    });
  
    return QrContacts;
  };
  