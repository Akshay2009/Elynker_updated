const db = require("../models");
const Sequelize = db.Sequelize;
const logErrorToFile = require("../logger");
const serviceResponse = require("../config/serviceResponse");
const { where } = require("sequelize");
const Jobs = db.jobs;
const Category = db.category;
const Registration = db.registration;

/**
 * Controller function to save jobs details---
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

module.exports.saveJobs = async function (req, res) {
  try {
    const {
      title,
      category_id,
      description,
      min_experience,
      job_location,
      created_by,
      updated_by,
      registrationId,
    } = req.body;
    if (!registrationId) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.registrationNotFound });
    }
    if (!category_id) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: "Category not provided" });
    }
    const regRecord = await Registration.findByPk(registrationId);
    if (!regRecord) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.registrationNotFound });
    }
    // Split comma-separated category IDs into an array
    const categoryIdsArray = category_id.split(",");
    const categoryRecords = await Category.findAll({
      where: {
        id: categoryIdsArray,
      },
    });
    if (categoryRecords.length == 0) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: "No category record found with provided categories" });
    }
    const catArray = categoryRecords.map((cat) => cat.id);

    const record = await Jobs.create({
      title,
      category_id: catArray.join(","),
      description,
      min_experience,
      job_location,
      created_by,
      updated_by,
      registrationId,
    });
    if (record) {
      await record.addCategories(categoryRecords);
      return res
        .status(serviceResponse.saveSuccess)
        .json({ message: serviceResponse.createdMessage, data: record });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, "jobs.controller", "saveJobs");
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
 * Controller function to update jobs details---
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

module.exports.updateJobs = async function (req, res) {
  try {
    const id = req.params.id;
    const {
      title,
      category_id,
      description,
      min_experience,
      job_location,
      created_by,
      updated_by,
      registrationId,
    } = req.body;

    const existingJob = await Jobs.findByPk(id);
    if (!existingJob) {
      return res
        .status(serviceResponse.notFound)
        .json({ error: serviceResponse.errorNotFound });
    }
    if (registrationId) {
      const regRecord = await Registration.findByPk(registrationId);
      if (!regRecord) {
        return res
          .status(serviceResponse.badRequest)
          .json({ error: serviceResponse.registrationNotFound });
      }
    }
    let catArray = (await existingJob.getCategories()).map((entry) => entry.id);
    if (category_id) {
      // Split comma-separated category IDs into an array
      const categoryIdsArray = category_id.split(",");
      const categoryRecords = await Category.findAll({
        where: {
          id: categoryIdsArray,
        },
      });
      if (categoryRecords.length == 0) {
        return res.status(serviceResponse.badRequest).json({
          error: "No category record found with provided categories",
        });
      }
      catArray = categoryRecords.map((cat) => cat.id);
    }

    const [row, record] = await Jobs.update(
      {
        title,
        category_id: catArray.join(","),
        description,
        min_experience,
        job_location,
        created_by,
        updated_by,
        registrationId,
      },
      {
        where: {
          id: id,
        },
        returning: true,
      }
    );
    if (row) {
      await record[0].setCategories(catArray);
      return res
        .status(serviceResponse.ok)
        .json({ message: serviceResponse.updatedMessage, data: record[0] });
    } else {
      return res.status(serviceResponse.badRequest).json({
        error: serviceResponse.errorUpdatingMessage,
      });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, "jobs.controller", "updateJobs");
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
 * Controller function to delete jobs details---
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.deleteJobs = async function (req, res) {
  try {
    const id = req.params.id;

    const existingJob = await Jobs.findByPk(id);
    if (!existingJob) {
      return res
        .status(serviceResponse.notFound)
        .json({ error: serviceResponse.errorNotFound });
    }
    const deletedRecord = await Jobs.destroy({
      where: {
        id: id,
      },
    });
    if (deletedRecord) {
      return res
        .status(serviceResponse.ok)
        .json({ message: serviceResponse.deletedMessage, data: existingJob });
    } else {
      return res.status(serviceResponse.badRequest).json({
        error: serviceResponse.errorDeletingMessage,
      });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, "jobs.controller", "deleteJobs");
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
 * Get All JObs details from the database.
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

    const { count, rows } = await Jobs.findAndCountAll({
      distinct: true,
      limit: pageSize,
      offset: offset,
      order: [["id", "ASC"]],
      include: [
        {
          model: Category,
          attributes: ["id", "title"],
          through: { attributes: [] } 
        },
        {
          model: Registration,
          attributes: ["id", "name"],
        },
      ],
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
    logErrorToFile.logErrorToFile(err, "jobs.controller", "getAll");
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
 * Get  Jobs details by search from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.search = async function (req, res) {
  try {
    const { fieldName, fieldValue } = req.params;
    if (!Jobs.rawAttributes[fieldName]) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.fieldNotExistMessage });
    }
    const records = await Jobs.findAll({
      where: {
        [fieldName]: fieldValue,
      },
      include: [
        {
          model: Category,
          attributes: ["id", "title"],
        },
        {
          model: Registration,
          attributes: ["id", "name"],
        },
      ],
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
    logErrorToFile.logErrorToFile(err, "Jobs.controller", "search");
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
 * Get  Jobs details by id from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.getById = async function (req, res) {
    try {
      const id = req.params.id;
      const records = await Jobs.findOne({
        where: {
          id:id,
        },
        include: [
          {
            model: Category,
            attributes: ["id", "title"],
          },
          {
            model: Registration,
            attributes: ["id", "name"],
          },
        ],
      });
      if (records) {
        return res
          .status(serviceResponse.ok)
          .json({ message: serviceResponse.getMessage, data: records });
      } else {
        return res
          .status(serviceResponse.notFound)
          .json({ error: serviceResponse.errorNotFound });
      }
    } catch (err) {
      logErrorToFile.logErrorToFile(err, "Jobs.controller", "search");
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