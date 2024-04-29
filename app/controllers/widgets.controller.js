const db = require("../models");
const Sequelize = db.Sequelize;
const logErrorToFile = require("../logger");
const serviceResponse = require("../config/serviceResponse");
const Widgets = db.widgets;

//*********End point to create widgets details****************/
module.exports.saveWidgets = async function (req, res) {
  try {
    const arr = req.body;
    if (!arr.length) {
      return res.status(serviceResponse.badRequest).json({
        error: 'Please provide your  data in json array[]!',
      });
    }
    const result = await Widgets.bulkCreate(arr, {
      updateOnDuplicate: [
        'widget_name',
        'page_name',
        'is_active',
        'rank',
        'updated_by',
      ],
    });
    if (result) {
      return res.status(serviceResponse.saveSuccess).json({
        success: serviceResponse.createdMessage,
        data: result,
      });
    }
  }catch (err) {
    logErrorToFile.logErrorToFile(err, "widgets.controller", "saveWidgets");
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

//*********End point to get all widgets details****************//

module.exports.getWidgets = async function (req, res) {
  try {
    const maxLimit = 50;
    let { page, pageSize } = req.query;
    page = page ? page : 1;
    let offset = 0;
    if (page && pageSize) {
      pageSize = pageSize <= maxLimit ? pageSize : maxLimit;
      offset = (page - 1) * pageSize;
    }

    const { count, rows } = await Widgets.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [["rank", "ASC"]],
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
    logErrorToFile.logErrorToFile(err, "widgets.controller", "getWidgets");
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

//*********End point to update widgets details****************//

module.exports.updateWidgets = async function (req, res) {
  try {
    const { id } = req.params;
    const { widget_name, page_name, is_active, rank, updated_by } = req.body;

    const [row, record] = await Widgets.update(
      {
        widget_name,
        page_name,
        is_active,
        rank,
        updated_by,
      },
      {
        where: {
          id: id,
        },
        returning: true,
      }
    );
    if(row){
      return res.status(serviceResponse.ok).json({
        message: serviceResponse.updatedMessage,
        data: record[0],
      });
    }else{
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, "widgets.controller", "updateWidgets");
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
