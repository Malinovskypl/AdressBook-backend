module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contacts", {
      contact_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      contact_name: {
        type: Sequelize.STRING(90)
      },
      contact_surname: {
        type: Sequelize.STRING(90)
      },
      contact_bday: {
        type: Sequelize.DATEONLY
      },
      contact_photo: {
        type: Sequelize.STRING(255)
      }
    });
    return Contact;
  };
  