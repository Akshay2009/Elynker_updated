const db = require("../models");
const Sequelize = db.Sequelize;
const logErrorToFile = require("../logger");
const serviceResponse = require("../config/serviceResponse");
const Subscription = db.subscription;
const AdminTool = db.adminTools;
/**
 * End point to save subscription details--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.save = async function (req, res) {
  try {
    const {
      name,
      description,
      duration,
      price,
      services,
      tax,
      discount,
      created_by,
      updated_by,
    } = req.body;

    const servicesArray = services.split(",");

    if (servicesArray.length === 0) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: "No services provided" });
    }

    const adminTools = await AdminTool.findAll({
      where: {
        title: servicesArray,
      },
    });
    const titlesArray = adminTools.map((tool) => tool.dataValues.title);
    const titlesString = titlesArray.join(",");
    const record = await Subscription.create({
      name,
      description,
      duration,
      price,
      services: titlesString,
      tax,
      discount,
      created_by,
      updated_by,
    });

    if (record) {
      return res
        .status(serviceResponse.saveSuccess)
        .json({ message: serviceResponse.createdMessage, data: record });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, "subscription.controller", "save");
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
 * End point to update subscription details--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.update = async function (req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      duration,
      price,
      services,
      tax,
      discount,
      created_by,
      updated_by,
    } = req.body;
    let updateObject = {
      name,
      description,
      duration,
      price,
      tax,
      discount,
      created_by,
      updated_by,
    };

    if (services) {
      const servicesArray = services.split(",");

      if (servicesArray.length === 0) {
        return res
          .status(serviceResponse.badRequest)
          .json({ error: "No services provided" });
      }

      const adminTools = await AdminTool.findAll({
        where: {
          title: servicesArray,
        },
      });

      if (adminTools.length !== 0) {
        const titlesArray = adminTools.map((tool) => tool.dataValues.title);
        const titlesString = titlesArray.join(",");
        updateObject.services = titlesString;
      }
    }
    const [row, record] = await Subscription.update(updateObject, {
      where: {
        id: id,
      },
      returning: true,
    });
    if (row) {
      return res.status(serviceResponse.ok).json({
        message: serviceResponse.updatedMessage,
        data: record[0],
      });
    } else {
      return res
        .status(serviceResponse.notFound)
        .json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, "subscription.controller", "update");
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
 * End point to DELETE subscription details--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.delete = async function (req, res) {
  try {
    const { id } = req.params;
    const Records = await Subscription.findByPk(id);
    if (Records) {
      const delrecord = await Subscription.destroy({ where: { id: id } });
      if (delrecord) {
        return res
          .status(serviceResponse.ok)
          .json({ message: serviceResponse.deletedMessage, data: Records });
      }
    } else {
      return res
        .status(serviceResponse.notFound)
        .json({ message: serviceResponse.errorNotFound });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, "subscription.controller", "delete");
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
 * End point to get all subscription details--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.getAll = async (req, res, next) => {
  try {
    const maxLimit = 50;
    let { page, pageSize } = req.query;
    page = page ? page : 1;
    let offset = 0;
    if (page && pageSize) {
      pageSize = pageSize <= maxLimit ? pageSize : maxLimit;
      offset = (page - 1) * pageSize;
    }

    const { count, rows } = await Subscription.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [["id", "ASC"]],
    });
    if (count > 0) {
      return res.status(serviceResponse.ok).json({
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
    logErrorToFile.logErrorToFile(err, "subscription.controller", "getAll");
    if (err instanceof db.Sequelize.Error) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: err.message + " " + err.errors[0].message });
    }
    return res.status(serviceResponse.internalServerError).json({
      error: serviceResponse.internalServerErrorMessage + " " + err.message,
    });
  }
};

/**
 * End point to get subscription details by search--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.search = async function (req, res) {
  try {
    const { fieldName, fieldValue } = req.params;
    if (!Subscription.rawAttributes[fieldName]) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.fieldNotExistMessage });
    }
    const records = await Subscription.findAll({
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
    logErrorToFile.logErrorToFile(err, "subscription.controller", "search");
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