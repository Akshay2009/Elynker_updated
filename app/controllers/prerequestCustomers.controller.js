const db = require("../models");
const Sequelize = db.Sequelize;
const serviceResponse = require("../config/serviceResponse");
const logErrorToFile = require("../logger");
const { where } = require("sequelize");
const PrerequestCustomers = db.prerequestCustomers;
require("dotenv").config();
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SibApiV3Sdk = require("@getbrevo/brevo");
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = BREVO_API_KEY;
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
const {
  htmlContentBusiness,
  htmlContentFreelancer,
} = require("../config/mailTemplateBusiness");

/**
 * Post function to save PrerequestCustomers details to the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.savePrerequestCustomers = async function (req, res) {
  try {
    const { name, email, mobile_number, type, created_by, updated_by } =
      req.body;
    if (!name || !email || !mobile_number || !type) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: "All fields are Required" });
    }
    const record = await PrerequestCustomers.create({
      name,
      email,
      mobile_number,
      type,
      created_by,
      updated_by,
    });
    if (record) {
      // Prepare the email content
      sendSmtpEmail.subject = "{{params.subject}}";

      if (type.toString().toLowerCase() === "freelancer" || type.toString().toLowerCase() === "service") {
        sendSmtpEmail.htmlContent = `Dear ${name}, ${htmlContentFreelancer}`;
      } else {
        sendSmtpEmail.htmlContent = `Dear ${name}, ${htmlContentBusiness}`;
      }
      sendSmtpEmail.sender = { name: "Elynker", email: process.env.MAIL_FROM };
      sendSmtpEmail.to = [{ email: email, name: name }];
      // sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
      // sendSmtpEmail.bcc = [{"name":"John Doe","email":"example@example.com"}];
      //sendSmtpEmail.replyTo = { email: "noreply@elynker.com", name: "Elynker" };
      const uid = Math.floor(10000000 + Math.random() * 90000000);

      sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-"+uid };
      sendSmtpEmail.params = {
        parameter:
          "Your Registration has been Successfully Completed, at Elynker",
        subject:
          "Confirmation of Your Pre-Launch Registration with Elynker",
      };

      apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log(
          "API called successfully. Returned data: " + JSON.stringify(data)
        );
      });

      return res
        .status(serviceResponse.saveSuccess)
        .json({ message: serviceResponse.createdMessage, data: record });
    } else {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.errorCreatingRecord });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(
      err,
      "prerequestCustomers.controller",
      "savePrerequestCustomers"
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
 * Post function to get All PrerequestCustomers details from the database.
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

    const { count, rows } = await PrerequestCustomers.findAndCountAll({
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
      "prerequestCustomers.controller",
      "getAll"
    );
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
 * End point to get prerequestCustomers details by search--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.search = async function (req, res) {
  try {
    const { fieldName, fieldValue } = req.params;
    if (!PrerequestCustomers.rawAttributes[fieldName]) {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.fieldNotExistMessage });
    }
    const records = await PrerequestCustomers.findAll({
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
    logErrorToFile.logErrorToFile(
      err,
      "prerequestCustomers.controller",
      "search"
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
 * End point to get prerequestCustomers details by Id--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.getById = async function (req, res) {
  try {
    const id = req.params.id;
    const Record = await PrerequestCustomers.findOne({
      where: { id: id },
    });

    if (Record) {
      return res.status(serviceResponse.ok).json({
        message: serviceResponse.getMessage,
        data: Record,
      });
    } else {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    logErrorToFile.logErrorToFile(
      err,
      "prerequestCustomers.controller",
      "getById"
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
