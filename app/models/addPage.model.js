module.exports = (sequelize, Sequelize) => {
    const AddPage = sequelize.define('page_cms', {
        page_title: {
            type: Sequelize.STRING(50),
        },
        page_content: {
            type: Sequelize.STRING(500),
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: false, 
        },
        created_by: {
            type: Sequelize.NUMERIC,
        },
        updated_by: {
            type: Sequelize.NUMERIC,
        },
    });

    return AddPage;
};
