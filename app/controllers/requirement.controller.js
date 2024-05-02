const db = require('../models');
const Requirement = db.requirement;
const Sequelize = db.Sequelize;
const logErrorToFile = require('../logger');
const serviceResponse = require('../config/serviceResponse');
const Registration = db.registration;


/**
 * Save Requirement details to the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.saveRequirement = async function(req, res) {
    try {
        const { product_type, product_service_name, category, order_quantity, location, description, budget, name, comments, mobile_number, status, created_by, updated_by, registrationId } = req.body;
        if(!registrationId){
            return res.status(serviceResponse.badRequest).json({ error: 'RegistrationId not provided' });
        }
        const regRecord = await Registration.findByPk(registrationId);
        if(!regRecord){
            return res.status(serviceResponse.badRequest).json({ error: serviceResponse.registrationNotFound });
        }
        
        if (parseInt(product_type) === 1) {
            // product_type 1: budget should NOT be provided
            if (budget !== undefined) {
                return res.status(serviceResponse.badRequest).json({ error: 'For Product, budget should not be provided.' });
            }
        } else if (parseInt(product_type) === 2) {
            // product_type 2: order_quantity should NOT be provided
            if (order_quantity !== undefined) {
                return res.status(serviceResponse.badRequest).json({ error: 'For Service, order_quantity should not be provided.' });
            }
        } else {
            return res.status(serviceResponse.badRequest).json({ error: 'Invalid product_type specified.' });
        }

        const record = await Requirement.create({
            product_type: parseInt(product_type),
            product_service_name,
            category,
            order_quantity,
            location,
            description,
            budget,
            name,
            comments,
            mobile_number,
            status,
            created_by,
            updated_by,
            registrationId: registrationId
        });
        if(record) {
            return res.status(serviceResponse.saveSuccess).json({ message: serviceResponse.createdMessage, data: record });
        }else{
            return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorCreatingRecord });
        }
    } catch(err) {
        logErrorToFile.logErrorToFile(err, 'requirement.controller', 'saveRequirement');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Update Requirement details to the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.updateRequirement = async function(req, res) {
    try{
        const id = req.params.id;
        let { product_type, product_service_name, category, order_quantity, location, description, budget, name, comments, mobile_number, status, created_by, updated_by, registrationId  } = req.body;
        if(registrationId){
            const regRecord = await Registration.findByPk(registrationId);
            if (!regRecord) {
                return res.status(serviceResponse.badRequest).json({ error: serviceResponse.registrationNotFound });
            }
        }

        // Get existing record
        const existingRequirement = await Requirement.findByPk(id);

        if (!existingRequirement) {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }

        
        const previousProductType = existingRequirement.product_type;

        if (product_type) {
            if (parseInt(product_type) === 1) {
                // product_type 1: budget should NOT be provided
                if (budget !== undefined) {
                    return res.status(serviceResponse.badRequest).json({ error: 'For Product, budget should not be provided.' });
                }
                budget = null; // if product_type is changed
            } else if (parseInt(product_type) === 2) {
                // product_type 2: order_quantity should NOT be provided
                if (order_quantity !== undefined) {
                    return res.status(serviceResponse.badRequest).json({ error: 'For Service, order_quantity should not be provided.' });
                }
                order_quantity = null; // if product_type is changed
            } else {
                return res.status(serviceResponse.badRequest).json({ error: 'Invalid product_type specified.' });
            }
        } else {
            // If product_type is not provided, use the previous product_type for validations
            if (previousProductType === 1 && budget !== undefined) {
                return res.status(serviceResponse.badRequest).json({ error: 'Existing Requirement Record is Product, budget should not be provided.' });
            } else if (previousProductType === 2 && order_quantity !== undefined) {
                return res.status(serviceResponse.badRequest).json({ error: 'Existing Requirement Record is Service, order_quantity should not be provided.' });
            }
        }

        const [row, record] = await Requirement.update({
            product_type: product_type,
            product_service_name: product_service_name,
            category: category,
            order_quantity: order_quantity,
            location: location,
            description: description,
            budget: budget,
            name: name,
            comments: comments,
            mobile_number: mobile_number,
            status: status,
            created_by,
            updated_by,
            registrationId: registrationId,
        }, {
            where: {
                id: id,
            },
            returning: true,
        });
        if(row) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.updatedMessage, data: record[0] });
        }else{
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch(err) {
        logErrorToFile.logErrorToFile(err, 'requirement.controller', 'updateRequirement');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Delete Requirement details from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.deleteRequirement = async function(req, res) {
    try{
        const id = req.params.id;
        const recordToDelete = await Requirement.findByPk(id);
        if(!recordToDelete) {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
        const deletedRecord = await Requirement.destroy({
            where: {
                id: id,
            },
        });
        if(deletedRecord) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.deletedMessage, data: recordToDelete });
        }else{
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    }catch (err) {
        logErrorToFile.logErrorToFile(err, 'requirement.controller', 'deleteRequirement');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Search Requirement details by ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.getRequirementById = async function(req, res) {
    try {
        const id = req.params.id;
        const record = await Requirement.findOne({
            where: {
                id: id,
            },
        });
        if (record) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: record });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'requirement.controller', 'getRequirementById');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Search All Requirement details from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.getAll = async function(req, res) {
    try {
        const maxLimit = 50;
        let { page, pageSize } = req.query;
        page = page ? page : 1;
        let offset = 0;
        if (page && pageSize) {
          pageSize = pageSize <= maxLimit ? pageSize : maxLimit;
          offset = (page - 1) * pageSize;
        }
    
        const { count, rows } = await Requirement.findAndCountAll({
          limit: pageSize,
          offset: offset,
          order: [['createdAt', 'ASC']],
        });
        if (count > 0) {
            const categorizedData = rows.map(entry => {
                const productType = entry.product_type == 1 ? "Product" : "Service";
                let responseData = { 
                    ...entry.toJSON(),
                    product_type: productType 
                };

                if (productType === "Product") {
                    delete responseData.budget;
                } else if (productType === "Service") {
                    delete responseData.order_quantity;
                }
        
                return responseData;
            });
            return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, totalRecords: count, data: categorizedData });
        } else {
          return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
      } catch (err) {
        logErrorToFile.logErrorToFile(err, 'requirement.controller', 'getAll');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Search Requirement details by fieldName and  fieldValue from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.search = async function(req, res) {
    try {
        const { fieldName, fieldValue } = req.params;
        if (!Requirement.rawAttributes[fieldName]) {
            return res.status(serviceResponse.badRequest).json({ error: serviceResponse.fieldNotExistMessage });
        }
        const records = await Requirement.findAll({
            where: {
                [fieldName]: fieldValue,
            },
        });
        if (records.length > 0) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: records });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'requirement.controller', 'search');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};