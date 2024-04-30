const db = require("../models");
const Sequelize = db.Sequelize;
const logErrorToFile = require("../logger");
const serviceResponse = require("../config/serviceResponse");
const SystemModules = db.systemModules;
const Registration = db.registration;

/**
 * End point to save system module details--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.saveSystemModules = async function (req, res) {
  try {
    const { module_name, is_active, created_by, updated_by } = req.body;
    const savemodules = await SystemModules.create({
      module_name,
      is_active,
      created_by,
      updated_by,
    });
    if (savemodules) {
      return res
        .status(serviceResponse.saveSuccess)
        .json({ message: serviceResponse.createdMessage, data: savemodules });
    }
    else{
        return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorCreatingRecord });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(
      err,
      "systemModules.controller",
      "saveSystemModules"
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
 * End point to get system module details by Id--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.getSystemModulesById = async function (req, res) {
  try {
    const id = req.params.id;
    const systemmodulerecord = await SystemModules.findOne({
      where: { id: id },
    });

    if (systemmodulerecord ) {
      return res.status(serviceResponse.ok).json({
        message: serviceResponse.getMessage,
        data: systemmodulerecord,
      });
    }else{
        return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(
      err,
      "systemModules.controller",
      "getSystemModulesById"
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
 * End point to get system module details--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.getSystemModules = async function (req, res) {
  try {
    const maxLimit = 50;
    let { page, pageSize } = req.query;
    page = page ? page : 1;
    let offset = 0;
    if (page && pageSize) {
      pageSize = pageSize <= maxLimit ? pageSize : maxLimit;
      offset = (page - 1) * pageSize;
    }
    const { count, rows } = await SystemModules.findAndCountAll({
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
    logErrorToFile.logErrorToFile(
      err,
      "systemModules.controller",
      "getSystemModules"
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
 * End point to update system module details by Id--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.updateSystemModules = async function (req, res) {
  try {
    const { id } = req.params;
    const { module_name, is_active, created_by, updated_by } = req.body;

    const [row, record] = await SystemModules.update(
      { module_name, is_active, created_by, updated_by },
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
      "systemModules.controller",
      "updateSystemModules"
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
 * End point to delete system module details--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.deleteSystemModules = async function (req, res) {
  try {
    const { id } = req.params;
    const Records = await SystemModules.findByPk(id);
    if (Records) {
      const delrecord = await SystemModules.destroy({ where: { id: id } });
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
      "systemModules.controller",
      "deleteSystemModules"
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
