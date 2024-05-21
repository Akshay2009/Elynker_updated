module.exports = (sequelize, Sequelize) => {
    const WidgetDetails = sequelize.define("widget_details", {
        title: {
            type: Sequelize.STRING(100)
        },
        sub_title: {
            type: Sequelize.STRING(200)
        },
        template: {
            type: Sequelize.STRING(50)
        },
        main_image: {
            type: Sequelize.STRING(200)
        },
        thumbnail_image: {
            type: Sequelize.STRING(200)
        },
        button_text: {
            type: Sequelize.STRING(200),
        },
        button_src: {
            type: Sequelize.STRING(200),
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        rank: {
            type: Sequelize.NUMERIC,
            validate: {
                min: 1,
            },
        },
        created_by: {
            type: Sequelize.NUMERIC,
        },
        updated_by: {
            type: Sequelize.NUMERIC,
        },
    });

    return WidgetDetails;
};
