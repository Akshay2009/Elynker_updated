const db = require("../models");
const Sequelize = db.Sequelize;
const logErrorToFile = require("../logger");
const serviceResponse = require("../config/serviceResponse");
const Reviews = db.vendorReviews;
const Registration = db.registration;
const path = require("path");
const fs = require("fs");
const REVIEW_IMAGE_PATH = path.join(process.env.REVIEW_IMAGE_PATH);

//####################### SAVE VENDOR REVIEWS ###############################//

module.exports.saveVendorReviews = async function (req, res) {
  try {
    const { reviewer_user_id , review_description, review_star, created_by, registrationId } =
      req.body;
    const registrationOfUser = await Registration.findOne({
      where: { userId: reviewer_user_id },
    });
    const existingRegistration = await Registration.findByPk(registrationId);
    if (!existingRegistration || !registrationOfUser) {
      fs.unlinkSync(
        path.join(
          __dirname,
          "../..",
          REVIEW_IMAGE_PATH,
          "/",
          req.files["image"][0].filename
        )
      );
      return res
        .status(serviceResponse.notFound)
        .json({ error: 'Vendor Registration not found or Reviewer Registration not found' });
    }
    let imagePath;
    if (req.files !== undefined && req.files["image"]) {
      imagePath = req.files["image"][0].filename;
    }
    const record = await Reviews.create({
      reviewer_user_id: reviewer_user_id,
      review_description: review_description,
      review_star: review_star,
      created_by: created_by,
      image_path: imagePath,
      registrationId: registrationId,
      reviewer_name: registrationOfUser.name,
      reviewer_image_path: registrationOfUser.image_path,
    });

    if (record) {
      return res.status(serviceResponse.saveSuccess).json({
        message: serviceResponse.createdMessage,
        data: record,
      });
    } else {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.errorCreatingRecord });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(
      err,
      "vendorReviews.controller",
      "saveVendorReviews"
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

//####################### GET VENDOR REVIEWS ###############################//

module.exports.getVendorReviews = async function (req, res) {
  try {
    const maxLimit = 50;
    let { page, pageSize } = req.query;
    page = page ? page : 1;
    let offset = 0;
    if (page && pageSize) {
      pageSize = pageSize <= maxLimit ? pageSize : maxLimit;
      offset = (page - 1) * pageSize;
    }
    const { count, rows } = await Reviews.findAndCountAll({
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
      "vendorReviews.controller",
      "getVendorReviews"
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

//####################### GET VENDOR REVIEWS BY REGISTRATION ID ###############################//

module.exports.getVendorReviewsByRegId = async function (req, res) {
  const registrationId = req.params.registrationId;
  const reviewsRecord = await Reviews.findAll({
    where: { registrationId: registrationId },
  });
  if (reviewsRecord.length > 0) {
    return res
      .status(serviceResponse.ok)
      .json({ message: serviceResponse.getMessage, data: reviewsRecord });
  } else {
    return res
      .status(serviceResponse.notFound)
      .json({ error: serviceResponse.errorNotFound });
  }
};
