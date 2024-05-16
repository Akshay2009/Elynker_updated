const db = require("../models");
const logErrorToFile = require("../logger");
const serviceResponse = require("../config/serviceResponse");
const multer = require("multer");
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

    // Use bulkCreate with updateOnDuplicate option
    await adminTools.bulkCreate(jsonData, {
      updateOnDuplicate: [
        "tools_title",
        "tools_icon_image",
        "tools_cover_image",
        "is_active",
      ], // Adjust the field names you want to update
    });

    // Optionally remove the file after processing
    fs.unlink(path, (err) => {
      if (err) {
        console.error("Failed to delete file:", err);
      }
    });

    return res.status(200).json({
      success: true,
      message: jsonData.length + " rows added or updated in the database",
    });
  } catch (err) {
    logErrorToFile.logErrorToFile(
      err,
      "adminTools.controller",
      "uploadXLSX"
    );
    if (err instanceof db.Sequelize.Error) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: err.message + " " + err.errors[0].message });
    }
    return res
      .status(serviceResponse.internalServerError)
      .json({
        error: serviceResponse.internalServerErrorMessage + " " + err.message,
      });
  }
};