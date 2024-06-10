const db = require('../models');
const Enquiry = db.enquiry;
const Sequelize = db.Sequelize;
const logErrorToFile = require('../logger');
const serviceResponse = require('../config/serviceResponse');
const Registration = db.registration;

/**
 * Save Enquiry details to the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.saveEnquiry = async function(req, res) {
    try {
        const { email, name, phone_number, comments, status, created_by, updated_by, registrationId, user_comment, type, type_id } = req.body;
        if(registrationId){
            const registrationRecod = await Registration.findByPk(registrationId);
            if(!registrationRecod){
                return res.status(serviceResponse.notFound).json({ error: serviceResponse.registrationNotFound });
            }
        }
        const record = await Enquiry.create({
            name,
            email,
            phone_number,
            comments,
            status,
            created_by,
            updated_by,
            registrationId,
            user_comment,
            type,
            type_id,
        });
        if(record) {
            return res.status(serviceResponse.saveSuccess).json({ message: serviceResponse.createdMessage, data: record });
        }else{
            return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorCreatingRecord });
        }
    } catch(err) {
        logErrorToFile.logErrorToFile(err, 'enquiry.controller', 'saveEnquiry');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message+' '+err.errors[0].message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Update Enquiry details to the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.updateEnquiry = async function(req, res) {
    try{
        const id = req.params.id;
        const { email, name, phone_number, comments, status, created_by, updated_by, registrationId, user_comment, type, type_id } = req.body;
        
        if(registrationId){
            const registrationRecod = await Registration.findByPk(registrationId);
            if(!registrationRecod){
                return res.status(serviceResponse.notFound).json({ error: serviceResponse.registrationNotFound });
            }
        }
        const [row, record] = await Enquiry.update({
            name,
            email,
            phone_number,
            comments,
            status,
            created_by,
            updated_by,
            registrationId,
            user_comment,
            type,
            type_id,
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
        logErrorToFile.logErrorToFile(err, 'enquiry.controller', 'updateEnquiry');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message+' '+err.errors[0].message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Delete Enquiry details from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.deleteEnquiry = async function(req, res) {
    try{
        const id = req.params.id;
        const recordToDelete = await Enquiry.findByPk(id);
        if(!recordToDelete) {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
        const deletedRecord = await Enquiry.destroy({
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
        logErrorToFile.logErrorToFile(err, 'enquiry.controller', 'deleteEnquiry');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message+' '+err.errors[0].message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Search All Enquiry details from the database.
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
    
        const { count, rows } = await Enquiry.findAndCountAll({
          limit: pageSize,
          offset: offset,
          order: [['createdAt', 'ASC']],
        });
        if (count > 0) {
          return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, totalRecords: count, data: rows });
        } else {
          return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
      } catch (err) {
        logErrorToFile.logErrorToFile(err, 'enquiry.controller', 'getAll');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Search Enquiry details by ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.getEnquiryById = async function(req, res) {
    try {
        const id = req.params.id;
        const record = await Enquiry.findOne({
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
        logErrorToFile.logErrorToFile(err, 'enquiry.controller', 'getEnquiryById');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Search Enquiry details by fieldName and  fieldValue from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.search = async function(req, res) {
    try {
        const { fieldName, fieldValue } = req.params;
        if (!Enquiry.rawAttributes[fieldName]) {
            return res.status(serviceResponse.badRequest).json({ error: serviceResponse.fieldNotExistMessage });
        }
        const records = await Enquiry.findAll({
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
        logErrorToFile.logErrorToFile(err, 'enquiry.controller', 'search');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Search Enquiry details by registrationId from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.getEnquiryByRegistrationId = async function(req, res) {
    try {
        const registrationId = req.params.registrationId;
        const record = await Enquiry.findAll({
            where: {
                registrationId: registrationId,
            },
            order: [['updatedAt', 'DESC']],
        });
        if (record.length>0) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: record });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'enquiry.controller', 'getEnquiryByRegistrationId');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
};
