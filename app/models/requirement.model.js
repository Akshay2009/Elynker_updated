module.exports = (sequelize, Sequelize) => {
    const Requirement = sequelize.define('requirements', {
        product_type: {
            allowNull: false,
            type: Sequelize.INTEGER,
            validate: {
                isIn: [[1, 2]],
            },
        },
        product_service_name: {
            type: Sequelize.STRING(100),
        },
        category: {
            type: Sequelize.STRING(100),
        },
        order_quantity: {
            type: Sequelize.NUMERIC(10, 2),
        },
        location: {
            type: Sequelize.STRING(100),
        },
        description: {
            type: Sequelize.STRING(500),
        },
        budget: {
            type: Sequelize.NUMERIC(10, 2),
        },
        name: {
            type: Sequelize.STRING(100),
        },
        comments: {
            type: Sequelize.STRING(500),
        },
        status: {
            type: Sequelize.ENUM('pending', 'fulfilled', 'hold'),
            defaultValue: 'pending',
            validate: {
                isIn: [['pending', 'fulfilled', 'hold']], // Ensures only 'pending' or 'fulfilled' or 'hold values are accepted
            },
        },
        mobile_number: {
            type: Sequelize.STRING(10),
            validate: {
                len: {
                    args: [10, 10],
                    msg: 'Mobile Number must be of 10 characters',
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

    return Requirement;
};
