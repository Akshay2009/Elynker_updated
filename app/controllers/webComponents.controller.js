const db = require("../models");
const Sequelize = db.Sequelize;
const logErrorToFile = require("../logger");
const serviceResponse = require("../config/serviceResponse");
const WebComponents = db.webComponents;

module.exports.saveWebComponents = async function (req, res) {
  try {
    const { page_name, page_link, created_by, updated_by } = req.body;
    const record = await WebComponents.create({
      page_name,
      page_link,
      created_by,
      updated_by,
    });
    if (record) {
      return res
        .status(serviceResponse.saveSuccess)
        .json({ message: serviceResponse.createdMessage, data: record });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(
      err,
      "webComponents.controller",
      "saveWebComponents"
    );
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

    const { count, rows } = await WebComponents.findAndCountAll({
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
    logErrorToFile.logErrorToFile(err, "webComponents.controller", "getAll");
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

module.exports.updateWebComponent = async function (req, res) {
  try {
    const { id } = req.params;
    const { page_name, page_link, created_by, updated_by } = req.body;

    const [row, record] = await WebComponents.update(
      {
        page_name,
        page_link,
        created_by,
        updated_by,
      },
      {
        where: {
          id: id,
        },
        returning: true,
      }
    );
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
    logErrorToFile.logErrorToFile(
      err,
      "webComponents.controller",
      "updateWebComponent"
    );
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

module.exports.deleteWebComponent = async function (req, res) {
  try {
    const { id } = req.params;
    const Records = await WebComponents.findByPk(id);
    if (Records) {
      const delrecord = await WebComponents.destroy({ where: { id: id } });
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
    logErrorToFile.logErrorToFile(
      err,
      "webComponents.controller",
      "deleteWebComponent"
    );
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
 * Get  WebComponents details by search from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.search = async function (req, res) {
  try {
    const { fieldName, fieldValue } = req.params;
    if (!WebComponents.rawAttributes[fieldName]) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.fieldNotExistMessage });
    }
    const records = await WebComponents.findAll({
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
    logErrorToFile.logErrorToFile(err, "webComponents.controller", "search");
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
 * End point to get Web Components details by Id--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.GetWebComponentById = async function (req, res) {
  try {
    const id = req.params.id;
    const webComponentsRecords = await WebComponents.findOne({
      where: { id: id },
    });

    if (webComponentsRecords ) {
      return res.status(serviceResponse.ok).json({
        message: serviceResponse.getMessage,
        data: webComponentsRecords,
      });
    }else{
        return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(
      err,
      "webComponents.controller",
      "GetWebComponentById"
    );
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