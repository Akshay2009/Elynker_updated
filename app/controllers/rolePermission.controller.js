const db = require('../models');
const RolePermission = db.rolePermission;
const Role = db.role;
const SystemModule = db.systemModules;
const Sequelize = db.Sequelize;
const logErrorToFile = require('../logger');
const serviceResponse = require('../config/serviceResponse');

/**
 * Save RolePermission details in the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.save = async function (req, res) {
    try {
        const { system_module_id, is_addable, is_editable, is_viewable, is_deletable, created_by, updated_by } = req.body;
        if(!system_module_id){
            return res.status(serviceResponse.badRequest).json({ error: 'system_module_id not provided'});
        }
        const systemModuleRecord = await SystemModule.findByPk(system_module_id);
        if(!systemModuleRecord){
            return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorNotFound+' with provided system_module_id'});
        }
        const record = await RolePermission.create({
            system_module_id,
            is_addable,
            is_editable,
            is_viewable,
            is_deletable,
            created_by,
            updated_by,
            systemModuleId: system_module_id,
        });
        if (record) {
            return res.status(serviceResponse.saveSuccess).json({ message: serviceResponse.createdMessage, data: record });
        } else {
            return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorCreatingRecord });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'RolePermission.controller', 'save');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Update RolePermission details by ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.update = async function (req, res) {
    try {
        const id = req.params.id;
        const { system_module_id, is_addable, is_editable, is_viewable, is_deletable, created_by, updated_by } = req.body;
        const updateObject = {
            is_addable,
            is_editable,
            is_viewable,
            is_deletable,
            created_by,
            updated_by,
        }
        if(system_module_id){
            const systemModuleRecord = await SystemModule.findByPk(system_module_id);
            if(!systemModuleRecord){
                return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorNotFound+' with provided system_module_id'});
            }
            updateObject.system_module_id = system_module_id;
            updateObject.systemModuleId = system_module_id;
        }
        const [row, record] = await RolePermission.update(
            updateObject, {
            where: {
                id: id,
            },
            returning: true,
        });
        if (row > 0) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.updatedMessage, data: record[0] });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'RolePermission.controller', 'update');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Delete Module Permission details by ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.delete = async function (req, res) {
    try {
        const id = req.params.id;
        const recordToDelete = await RolePermission.findOne({ where: { id: id } });
        if (!recordToDelete) {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
        const deletedRecord = await RolePermission.destroy({
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
        logErrorToFile.logErrorToFile(err, 'RolePermission.controller', 'delete');
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
module.exports.getById = async function (req, res) {
    try {
        const id = req.params.id;
        const record = await RolePermission.findOne({
            where: {
                id: id,
            },
            include:[
                {
                    model: SystemModule,
                    attributes: ['id','module_name'],
                }
            ]
        });
        if (record) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: record });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'RolePermission.controller', 'getById');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Search All RolePermission details from the database.
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
    
        const { count, rows } = await RolePermission.findAndCountAll({
          limit: pageSize,
          offset: offset,
          order: [['systemModuleId', 'ASC']],
          include:[
                {
                    model: SystemModule,
                    attributes: ['id','module_name'],
                }
            ],
        });
        if (count > 0) {
          return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, totalRecords: count, data: rows });
        } else {
          return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
      } catch (err) {
        logErrorToFile.logErrorToFile(err, 'RolePermission.controller', 'getAll');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Search RolePermission details by fieldName and  fieldValue from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.search = async function (req, res) {
    try {
        const { fieldName, fieldValue } = req.params;
        if (!RolePermission.rawAttributes[fieldName]) {
            return res.status(serviceResponse.badRequest).json({ error: serviceResponse.fieldNotExistMessage });
        }
        const records = await RolePermission.findAll({
            where: {
                [fieldName]: fieldValue,
            },
            include:[
                {
                    model: SystemModule,
                    attributes: ['id','module_name'],
                }
            ],
        });
        if (records.length > 0) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: records });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'RolePermission.controller', 'search');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};