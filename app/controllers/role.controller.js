const db = require('../models');
const Role = db.role;
const RolePermission = db.rolePermission;
const Sequelize = db.Sequelize;
const logErrorToFile = require('../logger');
const serviceResponse = require('../config/serviceResponse');
const SystemModule = db.systemModules;


/**
 * Save Role details in the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.saveRole = async function (req, res) {
    try {
        const allRecords = await Role.findAll({
            order: [['id', 'ASC']],
        });
        const { name, permissions, created_by, updated_by } = req.body;
        if(!name || !permissions){
            return res.status(serviceResponse.badRequest).json({ error:" Name or permissions not provided "});
        }
        const arrayOfPermissions = permissions.split(",");
        const systemModulesRecord = await SystemModule.findAll({
            attributes: ['id'],
            where: {
                id: arrayOfPermissions
            }
        });
        const systemArray =[];
        systemModulesRecord.forEach(element => {
            systemArray.push(element.id);
        });
        let rolePermissionArray = [];
        for (const module of systemModulesRecord) {
            const [record] = await RolePermission.findOrCreate({
                where: { systemModuleId: module.id },
                defaults: {
                    system_module_id: module.id,
                    systemModuleId: module.id,
                },
            });
            rolePermissionArray.push(record.id);
        }

        const record = await Role.create({
            id: allRecords[allRecords.length - 1].id + 1, // get the last record id and do +1 to id 
            name: name,
            permissions: systemArray.join(","),
            created_by: created_by,
            updated_by: updated_by,
        });
        if (record) {
            if(rolePermissionArray.length>0){
                await record.setRole_permissions(rolePermissionArray);
            }
            return res.status(serviceResponse.saveSuccess).json({ message: serviceResponse.createdMessage, data: record });
        } else {
            return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorCreatingRecord });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'role.controller', 'saveRole');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Search Role details by ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.updateRole = async function (req, res) {
    try {
        const id = req.params.id;
        const { name, permissions, created_by, updated_by } = req.body;
        // Find the role by ID
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }

        const updateObject = {
            name: name,
            created_by: created_by,
            updated_by: updated_by
        };

        let permissonArray = [];
        let rolePermissionArray = [];
        if (permissions) {
            const arrayOfPermissions = permissions.split(",");
            const systemModulesRecords = await SystemModule.findAll({
                attributes: ['id'],
                where: {
                    id: arrayOfPermissions
                }
            });
            permissonArray = systemModulesRecords.map(permission => permission.id);
            for (const module of systemModulesRecords) {
                const [record] = await RolePermission.findOrCreate({
                    where: { systemModuleId: module.id },
                    defaults: {
                        system_module_id: module.id,
                        systemModuleId: module.id,
                    },
                });
                rolePermissionArray.push(record.id);
            }           
        }
        if(rolePermissionArray.length>0){
            rolePermissionArray = rolePermissionArray;
            updateObject.permissions = permissonArray.join(",");
        }
        
        const [row, record] = await Role.update(updateObject, {
            where: {
                id: id,
            },
            returning: true,
        });
        if (row > 0) {
            if(rolePermissionArray.length>0){
                await record[0].setRole_permissions(rolePermissionArray);
            }
            return res.status(serviceResponse.ok).json({ message: serviceResponse.updatedMessage, data: record[0] });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'role.controller', 'updateRole');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage+" "+err.message });
    }
};

/**
 * Delete Role details by ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.deleteRole = async function (req, res) {
    try {
        const id = req.params.id;
        const recordToDelete = await Role.findOne({ where: { id: id } });
        if (!recordToDelete) {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
        const deletedRecord = await Role.destroy({
            where: {
                id: id,
            },
        });
        if (deletedRecord > 0) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.deletedMessage, data: recordToDelete });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'role.controller', 'deleteRole');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Search All Role details from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.getAll = async function (req, res) {
    try {
        const maxLimit = 50;
        let { page, pageSize } = req.query;
        page = page ? page : 1;
        let offset = 0;
        if (page && pageSize) {
          pageSize = pageSize <= maxLimit ? pageSize : maxLimit;
          offset = (page - 1) * pageSize;
        }
    
        const { count, rows } = await Role.findAndCountAll({
          limit: pageSize,
          offset: offset,
          order: [['id', 'ASC']],
          include: [
            {
                model: RolePermission,
                include: [
                    {
                        model: SystemModule,
                        attributes: ['id','module_name', 'is_active'],
                    },
                ],
                through: { attributes: [] },
            },
        ],
        });
        if (count > 0) {
          return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, totalRecords: count, data: rows });
        } else {
          return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
      } catch (err) {
        logErrorToFile.logErrorToFile(err, 'role.controller', 'getAll');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};


/**
 * Search Role details by ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.getRoleById = async function (req, res) {
    try {
        const id = req.params.id;
        const record = await Role.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: RolePermission,
                    include: [
                        {
                            model: SystemModule,
                            attributes: ['id','module_name', 'is_active'],
                        },
                    ],
                    through: { attributes: [] },
                },
            ],
        });
        if (record) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: record });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'role.controller', 'getRoleById');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Search Role details by fieldName and  fieldValue from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.search = async function (req, res) {
    try {
        const { fieldName, fieldValue } = req.params;
        if (!Role.rawAttributes[fieldName]) {
            return res.status(serviceResponse.badRequest).json({ error: serviceResponse.fieldNotExistMessage });
        }
        const records = await Role.findAll({
            where: {
                [fieldName]: fieldValue,
            },
            include: [
                {
                    model: RolePermission,
                    include: [
                        {
                            model: SystemModule,
                            attributes: ['id','module_name', 'is_active'],
                        },
                    ],
                    through: { attributes: [] },
                },
            ],
        });
        if (records.length > 0) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: records });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'role.controller', 'search');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};
