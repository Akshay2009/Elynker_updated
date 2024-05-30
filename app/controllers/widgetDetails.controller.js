const db = require("../models");
const Sequelize = db.Sequelize;
const logErrorToFile = require("../logger");
const serviceResponse = require("../config/serviceResponse");
const WidgetDetails = db.widgetDetails;
const path = require("path");
const fs = require("fs");
const { error } = require("console");
const WIDGET_IMAGE_PATH = path.join(__dirname, "../../", process.env.WIDGET_IMAGE_PATH);
const Widgets = db.widgets;
const sharp = require('sharp');

//*********End point to create widgetsdetails****************/
module.exports.save = async function (req, res) {
  try {
    const { title, sub_title, template, button_text, button_src, is_active, rank, created_by, updated_by, widgetId } = req.body; 
    if (!req.files['image']) {
      return res.status(serviceResponse.badRequest).json({ error: 'Please Provide Image' });
    }
    const widgetRecord = await Widgets.findByPk(widgetId);
    if(!widgetRecord){
      return res.status(serviceResponse.badRequest).json({ error:'Widget Record not found with the provided widgetId'});
    }
    const mainImagePath = req.files['image'][0].path;
    const thumbnail_image = `thumb-${req.files['image'][0].filename}`;
    const thumbnailImagePath = path.join(WIDGET_IMAGE_PATH, thumbnail_image);
    // Create thumbnail
    await sharp(mainImagePath)
      .resize(parseInt(process.env.WIDGET_WIDTH))
      .toFile(thumbnailImagePath)
    
    const record = await WidgetDetails.create({
      title,
      sub_title,
      template,
      button_text,
      button_src,
      is_active,
      rank,
      main_image: req.files['image'][0].filename,
      thumbnail_image: thumbnail_image,
      created_by,
      updated_by,
      widgetId
    });
    if(record){
      return res.status(serviceResponse.saveSuccess).json({ message:serviceResponse.createdMessage, data:record});
    }else{
      return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorCreatingRecord});
    }
  }catch (err) {
    logErrorToFile.logErrorToFile(err, "widgetDetails.controller", "save");
    if (err instanceof Sequelize.Error) {
      return res.status(serviceResponse.badRequest).json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage+' '+err.message });
  }
};

//*********End point to update widgetsdetails by id ****************/
module.exports.update = async function (req, res) {
  try {
    const { title, sub_title, template, button_text, button_src, is_active, rank, created_by, updated_by, widgetId } = req.body;
    const { id } = req.params; // Assuming the ID is passed in the request parameters

    // Fetch the existing record
    let widgetDetail = await WidgetDetails.findByPk(id);
    if (!widgetDetail) {
      return res.status(serviceResponse.notFound).json({ error: 'Widget Detail not found with the provided ID' });
    }
    if (widgetId) {
      const widgetRecord = await Widgets.findByPk(widgetId);
      if (!widgetRecord) {
        return res.status(serviceResponse.badRequest).json({ error: 'Widget Record not found with the provided widgetId' });
      }
    }

    // Update fields other than images
    widgetDetail.title = title || widgetDetail.title;
    widgetDetail.sub_title = sub_title || widgetDetail.sub_title;
    widgetDetail.template = template || widgetDetail.template;
    widgetDetail.button_text = button_text || widgetDetail.button_text;
    widgetDetail.button_src = button_src || widgetDetail.button_src;
    widgetDetail.is_active = is_active || widgetDetail.is_active;
    widgetDetail.rank = rank || widgetDetail.rank;
    widgetDetail.created_by = created_by || widgetDetail.created_by;
    widgetDetail.updated_by = updated_by || widgetDetail.updated_by;
    widgetDetail.widgetId = widgetId || widgetDetail.widgetId;

    if (req.files && req.files['image']) {
      // If image is provided, update main_image and thumbnail_image
      const mainImagePath = req.files['image'][0].path;
      const thumbnail_image = `thumb-${req.files['image'][0].filename}`;
      const thumbnailImagePath = path.join(WIDGET_IMAGE_PATH, thumbnail_image);

      // Create thumbnail
      await sharp(mainImagePath)
        .resize(parseInt(process.env.WIDGET_WIDTH))
        .toFile(thumbnailImagePath);
      if (fs.existsSync(WIDGET_IMAGE_PATH + '/' + `${widgetDetail.main_image}`)) {
        fs.unlinkSync(WIDGET_IMAGE_PATH + '/' + `${widgetDetail.main_image}`);
      }
      if (fs.existsSync(WIDGET_IMAGE_PATH + '/' + `${widgetDetail.thumbnail_image}`)) {
        fs.unlinkSync(WIDGET_IMAGE_PATH + '/' + `${widgetDetail.thumbnail_image}`);
      }
      widgetDetail.main_image = req.files['image'][0].filename;
      widgetDetail.thumbnail_image = thumbnail_image;
    }

    // Save the updated record
    await widgetDetail.save();

    return res.status(serviceResponse.ok).json({ message: serviceResponse.updatedMessage, data: widgetDetail });

  }catch (err) {
    logErrorToFile.logErrorToFile(err, "widgetDetails.controller", "update");
    if (err instanceof Sequelize.Error) {
      return res.status(serviceResponse.badRequest).json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage+' '+err.message });
  }
};

//*********End point to Delete widgetsdetails by id ****************/
module.exports.delete = async function (req, res) {
  try {
    const { id } = req.params; // Assuming the ID is passed in the request parameters

    // Fetch the existing record
    const widgetDetail = await WidgetDetails.findByPk(id);
    if (!widgetDetail) {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }

    // Construct paths for main image and thumbnail image
    const mainImagePath = path.join(WIDGET_IMAGE_PATH, widgetDetail.main_image);
    const thumbnailImagePath = path.join(WIDGET_IMAGE_PATH, widgetDetail.thumbnail_image);

    // Delete the record from the database
    const delrecord = await WidgetDetails.destroy({ where: { id: id } });
    if (delrecord) {
      // Remove image files if they exist
      if (fs.existsSync(mainImagePath)) {
        fs.unlinkSync(mainImagePath);
      }
      if (fs.existsSync(thumbnailImagePath)) {
        fs.unlinkSync(thumbnailImagePath);
      }
      return res.status(serviceResponse.ok).json({ message: serviceResponse.deletedMessage, data:widgetDetail });
    }else{
      return res.status(serviceResponse.badRequest).json({ error:'Error in Deleting WidgetDetails Record' });
    }
    
  }catch (err) {
    logErrorToFile.logErrorToFile(err, "widgetDetails.controller", "delete");
    if (err instanceof Sequelize.Error) {
      return res.status(serviceResponse.badRequest).json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage+' '+err.message });
  }
};

/**
 * Get All WidgetDetails details from the database.
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

    const { count, rows } = await WidgetDetails.findAndCountAll({
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
    logErrorToFile.logErrorToFile(err, 'widgetDetails.controller', 'getAll');
    if (err instanceof Sequelize.Error) {
      return res.status(serviceResponse.badRequest).json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};


/**
 * Get  WidgetDetails details by id from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.getById = async function (req, res) {
  try {
    const id = req.params.id;
    const record = await WidgetDetails.findOne({
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
    logErrorToFile.logErrorToFile(err, 'widgetDetails.controller', 'getById');
    if (err instanceof Sequelize.Error) {
      return res.status(serviceResponse.badRequest).json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};


/**
 * Get  WidgetDetails details by id from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.search = async function (req, res) {
  try {
    const { fieldName, fieldValue } = req.params;
    if (!WidgetDetails.rawAttributes[fieldName]) {
      return res.status(serviceResponse.badRequest).json({ error: serviceResponse.fieldNotExistMessage });
    }
    const records = await WidgetDetails.findAll({
      where: {
        [fieldName]: fieldValue,
      },
      order: [['updatedAt', 'DESC']],
    });
    if (records.length > 0) {
      return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: records });
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(err, 'widgetDetails.controller', 'search');
    if (err instanceof Sequelize.Error) {
      return res.status(serviceResponse.badRequest).json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};
