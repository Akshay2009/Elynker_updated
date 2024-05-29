const db = require("../models");
const logErrorToFile = require("../logger");
const serviceResponse = require("../config/serviceResponse");
const fs = require("fs");
const adminTools = db.adminTools;
var XLSX = require("xlsx");

//Post and update data from excel sheet----------

module.exports.uploadXLSX = async (req, res, next) => {
  try {
    // Ensure req.file is not undefined
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    let path = req.file.path;
    var workbook = XLSX.readFile(path);
    var sheet_name_list = workbook.SheetNames;

    if (sheet_name_list.length === 0) {
      return res.status(400).json({
        success: false,
        message: "XLSX file has no sheets",
      });
    }

    let jsonData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );

    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "XLSX sheet has no data",
      });
    }

    // Ensure parent_id is not null, if null set to 0
    for(let i=0;i<jsonData.length;i++){
      const row = jsonData[i];
      if (row.parent_id == null) {
        row.parent_id = 0;
      }
      if (row.id === row.parent_id) {
        fs.unlinkSync(path);
        return res
        .status(serviceResponse.badRequest)
        .json({ error: `id and parent_id cannot be same`});
        
      }
    }
   

    // Use bulkCreate with updateOnDuplicate option for child records
    let records = await adminTools.bulkCreate( jsonData, {
      updateOnDuplicate: [
        "parent_id",
        "title",
        "description",
        "icon_image",
        "cover_image",
        "is_active",
        "service_type",
        "redirect_to",
      ],
    });

    return res.status(200).json({
      success: true,
      message: jsonData.length + " rows added or updated in the database",
      data: records
    });
  } catch (err) {
    logErrorToFile.logErrorToFile(err, "adminTools.controller", "uploadXLSX");
    if (err instanceof db.Sequelize.Error) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({
      error: serviceResponse.internalServerErrorMessage + " " + err.message,
    });
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

    const { count, rows } = await adminTools.findAndCountAll({
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
    logErrorToFile.logErrorToFile(err, "adminTools.controller", "getAll");
    if (err instanceof db.Sequelize.Error) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({
      error: serviceResponse.internalServerErrorMessage + " " + err.message,
    });
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const existingRecord = await adminTools.findByPk(id);
    const {
      tools_title,
      tools_icon_image,
      tools_cover_image,
      is_active,
      service_type,
      created_by,
      updated_by,
    } = req.body;
    if (!existingRecord) {
      return res
        .status(serviceResponse.notFound)
        .json({ error: serviceResponse.errorNotFound });
    }
    const [row, record] = await adminTools.update(
      {
        tools_title,
        tools_description,
        tools_icon_image,
        tools_cover_image,
        is_active,
        service_type,
        redirect_to,
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
      return res
        .status(serviceResponse.ok)
        .json({ message: serviceResponse.updatedMessage, data: record[0] });
    } else {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.errorUpdatingMessage });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, "adminTools.controller", "update");
    if (err instanceof db.Sequelize.Error) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({
      error: serviceResponse.internalServerErrorMessage + " " + err.message,
    });
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const existingRecord = await adminTools.findByPk(id);
    if (!existingRecord) {
      return res
        .status(serviceResponse.notFound)
        .json({ error: serviceResponse.errorNotFound });
    }
    const row = await adminTools.destroy({
      where: {
        id: id,
      },
    });
    if (row) {
      return res
        .status(serviceResponse.ok)
        .json({
          message: serviceResponse.deletedMessage,
          data: existingRecord,
        });
    } else {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.errorDeletingMessage });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, "adminTools.controller", "delete");
    if (err instanceof db.Sequelize.Error) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({
      error: serviceResponse.internalServerErrorMessage + " " + err.message,
    });
  }
};


/**
 * Get  AdminTools details by search from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.search = async function (req, res) {
  try {
    const { fieldName, fieldValue } = req.params;
    if (!adminTools.rawAttributes[fieldName]) {
      return res.status(serviceResponse.badRequest).json({ error: serviceResponse.fieldNotExistMessage });
    }
    const records = await adminTools.findAll({
      where: {
        [fieldName]: fieldValue,
      },
      order: [['id', 'ASC']],
    });
    if (records.length > 0) {
      return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: records });
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, 'adminTools.controller', 'search');
    if (err instanceof Sequelize.Error) {
      return res.status(serviceResponse.badRequest).json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
}; 