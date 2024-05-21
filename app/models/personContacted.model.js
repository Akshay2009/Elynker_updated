module.exports = (sequelize, Sequelize) => {
  const PersonContacted = sequelize.define("person_contacts", {
    person_contact: {
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

  return PersonContacted;
};
