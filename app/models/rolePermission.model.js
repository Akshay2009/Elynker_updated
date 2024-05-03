module.exports = (sequelize, Sequelize) => {
    const RolePermission = sequelize.define('role_permissions', {
        system_module_id: {
            type: Sequelize.NUMERIC,
            allowNull: false,
        },
        is_addable: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        is_editable: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        is_viewable: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        is_deletable: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        created_by: {
            type: Sequelize.NUMERIC,
        },
        updated_by: {
            type: Sequelize.NUMERIC,
        },
    });

    return RolePermission;
};
