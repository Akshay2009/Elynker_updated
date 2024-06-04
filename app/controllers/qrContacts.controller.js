const db = require("../models");
const Sequelize = db.Sequelize;
const serviceResponse = require("../config/serviceResponse");
const logErrorToFile = require("../logger");
const { where } = require("sequelize");
const QrContacts = db.qrContacts;
const Registration = db.registration;


/**
 * Post function to save personContacted details to the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.createPersonContacted = async function (req, res) {
  try {
    const { mobile_number, vendor_id, created_by, updated_by } = req.body;

    const existingRecord = await QrContacts.findOne({
      where: {
        mobile_number: mobile_number,
        vendor_id: vendor_id,
      },
    });

    if (existingRecord) {
      existingRecord.setDataValue("updatedAt", new Date());
      await existingRecord.save();
      return res.status(serviceResponse.ok).json({
        message: "Entry Exist",
        data: existingRecord,
      });
    }

    const ContactRecord = await QrContacts.create({
        mobile_number,
        vendor_id,
      created_by,
      updated_by,
    });

    if (ContactRecord) {
      return res.status(serviceResponse.saveSuccess).json({
        message: serviceResponse.createdMessage,
        data: ContactRecord,
      });
    } else {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.errorCreatingRecord });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(
      err,
      "qrContacts.controller",
      "createPersonContacted"
    );
    if (err instanceof Sequelize.Error) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: err.message + " " });
    }
    return res
      .status(serviceResponse.internalServerError)
      .json({ error: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Get All personContacted details from the database.
 *
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

    const { count, rows } = await QrContacts.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "ASC"]],
    });
    if (count > 0) {
      return res
        .status(serviceResponse.ok)
        .json({
          message: serviceResponse.getMessage,
          totalRecords: count,
          data: rows,
        });
    } else {
      return res
        .status(serviceResponse.notFound)
        .json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, "qrContacts.controller", "getAll");
    if (err instanceof Sequelize.Error) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: err.message });
    }
    return res
      .status(serviceResponse.internalServerError)
      .json({ error: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Get  personContacted details by search from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.search = async function (req, res) {
  try {
    const { fieldName, fieldValue } = req.params;
    if (!QrContacts.rawAttributes[fieldName]) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.fieldNotExistMessage });
    }
    const records = await QrContacts.findAll({
      where: {
        [fieldName]: fieldValue,
      },
    });
    if (records.length > 0) {
      return res
        .status(serviceResponse.ok)
        .json({ message: serviceResponse.getMessage, data: records });
    } else {
      return res
        .status(serviceResponse.notFound)
        .json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, "qrContacts.controller", "search");
    if (err instanceof Sequelize.Error) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: err.message });
    }
    return res
      .status(serviceResponse.internalServerError)
      .json({ error: serviceResponse.internalServerErrorMessage });
  }
};
