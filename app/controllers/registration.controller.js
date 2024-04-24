const db = require('../models');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const COMPANY_LOGO_PATH = path.join(process.env.COMPANY_LOGO_PATH);
const COVER_IMAGE_PATH = path.join(process.env.COVER_IMAGE_PATH);
const Registration = db.registration;
const BusinessDetail = db.businessDetail;
const Category = db.category;
const serviceResponse = require('../config/serviceResponse');

/**
 * Controller function to update company logo .
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.updateCompanyLogo = async function (req, res) {
  try {
    const registration = await Registration.findByPk(req.params.id);
    let companyLogo;
    if (req.files['images']) {
      companyLogo = req.files['images'];
    }

    if (companyLogo && companyLogo.length > 0) {
      if (registration.image_path) {
        fs.unlinkSync(
          path.join(
            __dirname,
            '../..',
            COMPANY_LOGO_PATH,
            '/',
            registration.image_path,
          ),
        );
      }
      registration.image_path = companyLogo[0].filename;
      await registration.save();
      return res.status(serviceResponse.ok).json({
        success: 'Company Logo Updated Successfully',
        registration: registration,
      });
    } else {
      return res.status(serviceResponse.badRequest).json({ error: 'Please Provide company Logo Image' });
    }
  } catch (err) {
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Controller function to update cover Image .
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.updateCoverImage = async function (req, res) {
  const registration = await Registration.findByPk(req.params.registrationId);
  let coverImages;
  if (req.files['images']) {
    coverImages = req.files['images'];
  }

  if (coverImages && coverImages.length > 0) {
    if (registration.cover_image) {
      fs.unlinkSync(
        path.join(
          __dirname,
          '../..',
          COVER_IMAGE_PATH,
          '/',
          registration.cover_image,
        ),
      );
    }
    registration.cover_image = coverImages[0].filename;
    await registration.save();
    return res.status(serviceResponse.ok).json({
      success: 'Cover Image Updated Successfully',
      registration: registration,
    });
  } else {
    return res.status(serviceResponse.badRequest).json({ error: 'Please Provide company Logo Image' });
  }
};

module.exports.saveBusinessDetail = async function (req, res) {
  const reg_Id = req.params.reg_id;
  const existingRegistration = await Registration.findByPk(reg_Id);

  if (!existingRegistration) {
    return res
      .status(serviceResponse.notFound)
      .json({ error: serviceResponse.registrationNotFound });
  }

  const arr = req.body;

  if (!arr.length) {
    return res.status(serviceResponse.badRequest).json({
      error: 'Please provide your business data in json array[]!',
    });
  }

  const updatedArr = arr.map((item) => {
    return {
      ...item,
      registrationId: reg_Id, // Add registrationId
    };
  });
  let validationFlag = true;
  for (let i = 0; i < updatedArr.length; i++) {
    const item = updatedArr[i];
    if (item.is_provided === false) {
      if (!item.no_document_reason) {
        validationFlag = false;
        break;
      }
    }
  }
  if (validationFlag === false) {
    return res
      .status(serviceResponse.badRequest)
      .json({ error: 'Please provide a reason when is_provided is false or not provided' });
  }
  const result = await BusinessDetail.bulkCreate(updatedArr, {
    updateOnDuplicate: [
      'company_name',
      'document',
      'is_active',
      'document_name',
      'document_number',
      'file_location',
      'file_name',
      'is_provided',
      'no_document_reason',
    ],
  });

  // const { company_name,document,is_active,document_name,document_number,is_provided,no_document_reason } = req.body;
  // const result = await BusinessDetail.create({company_name,document,is_active,document_name,document_number,is_provided,no_document_reason,registrationId:reg_Id});
  await Registration.update(
    { company_name: arr[0].company_name },
    { where: { id: reg_Id } },
  );
  if (result) {
    return res.status(serviceResponse.saveSuccess).json({
      success: serviceResponse.createdMessage,
      data: result,
    });
  }
};

/**
 * Controller function for get business details .
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.getBusinessDetail = async function (req, res) {
  const { reg_id } = req.params;
  // Fetch the details by ID
  const existingRegistration = await Registration.findByPk(reg_id);

  if (!existingRegistration) {
    return res
      .status(serviceResponse.notFound)
      .json({ message: serviceResponse.registrationNotFound });
  }

  const businessDetails = await BusinessDetail.findAll({
    where: { registrationId: reg_id },
  });

  if (businessDetails) {
    // Return the details in the response
    return res.status(serviceResponse.ok).json(businessDetails);
  } else {
    return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
  }
};
// registration post request---------------

module.exports.putRegDetail = async function (req, res) {
  const {
    name,
    business_type,
    ip_address,
    registration_type,
    dob,
    latitude,
    longitude,
    steps_completed,
    active_steps,
    address1,
    address2,
    state,
    city,
    country,
    education,
    available_hrs_per_week,
    hourly_rate,
    service_fee,
    freelancer_role,
    freelancer_bio,
    language,
    currency_id,
    about_company,
    whatsapp_number,
    last_login,
    status,
    rejected_reason,
    created_by,
    updated_by,
    company_name,
    additional_detail1,
    additional_detail2,
    additional_detail3,
    rating,
  } = req.body;

  const registrationId = req.params.reg_id;
  const existingRegistration = await Registration.findByPk(registrationId);
  let newRating;
  let newRatingMemberCount;
  

  if (!existingRegistration) {
    return res.status(serviceResponse.notFound).json({ error: serviceResponse.registrationNotFound });
  } else if (existingRegistration) {
    if(rating >=0 ){
      if(parseFloat(rating) > 5.00){
        return res.status(serviceResponse.badRequest).json({ error: 'Invalid Rating Value Provided' });
      }
      newRatingMemberCount = existingRegistration.rating_member_count + 1;
      newRating = ((existingRegistration.rating * existingRegistration.rating_member_count) + rating)/newRatingMemberCount;
    }else{
      newRatingMemberCount = existingRegistration.rating_member_count;
      newRating = existingRegistration.rating;
    }
    
    const [row, record] = await Registration.update(
      {
        name,
        ip_address,
        business_type,
        registration_type,
        dob,
        latitude,
        longitude,
        steps_completed,
        active_steps,
        address1,
        address2,
        city,
        state,
        country,
        education,
        available_hrs_per_week,
        hourly_rate,
        service_fee,
        freelancer_role,
        freelancer_bio,
        language,
        about_company,
        currency_id,
        whatsapp_number,
        last_login,
        status,
        rejected_reason,
        created_by,
        updated_by,
        company_name,
        additional_detail1,
        additional_detail2,
        additional_detail3,
        rating: newRating,
        rating_member_count: newRatingMemberCount,
      },
      {
        where: {
          id: registrationId,
        },
        returning: true,
      },
    );
    if (row > 0) {
      return res.status(serviceResponse.ok).json({
        message: serviceResponse.updatedMessage,
        updatedRegistration: record[0],
      });
    }
  } else {
    return res.status(serviceResponse.badRequest).json({ error: 'Error in updating Registration' });
  }
};

module.exports.updateCategoryIds = async function (req, res) {
  const registrationId = req.params.registrationId;
  const { category_ids } = req.body;
  if (!category_ids) {
    return res
      .status(serviceResponse.badRequest)
      .json({ error: 'Category Ids for Registration Not Provided' });
  }
  const existingRegistration = await Registration.findByPk(registrationId);

  if (!existingRegistration) {
    return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
  }

  // Split comma-separated category IDs into an array
  const categoryIdsArray = category_ids.split(',');
  const categories = await Category.findAll({
    where: {
      id: categoryIdsArray,
    },
  });
  if (categories.length == 0) {
    return res
      .status(serviceResponse.badRequest)
      .json({ error: 'No category with provided Category Ids Present' });
  }
  const catArray = [];
  categories.forEach((cat) => {
    catArray.push(cat.id);
  });

  const [rowUpdated, registrationUpdated] = await Registration.update(
    {
      category_ids: catArray.join(','),
    },
    {
      where: {
        id: registrationId,
      },
      returning: true,
    },
  );
  if (rowUpdated > 0) {
    return res.status(serviceResponse.ok).json(registrationUpdated[0]);
  } else {
    return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
  }
};

// API TO GET REGISTRATION DETAILS BY USER ID:
module.exports.getRegById = async function (req, res) {
  try {
    const { user_id } = req.params;
    if (user_id == 0 || user_id === 'null') {
      return res
        .status(serviceResponse.badRequest)
        .json({ error: 'Unable to find User Id kindly provide Valid User Id' });
    }
    const getRegById = await Registration.findOne({ where: { userId: user_id } });
    if (getRegById) {
      return res
        .status(serviceResponse.ok)
        .json({ message: serviceResponse.getMessage, data: getRegById });
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (error) {
    res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Search Regisration details by fieldName and  fieldValue from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.search = async function (req, res) {
  try {
    const { fieldName, fieldValue } = req.params;
    if (!Registration.rawAttributes[fieldName]) {
      return res.status(serviceResponse.badRequest).json({ error: serviceResponse.fieldNotExistMessage });
    }
    const records = await Registration.findAll({
      where: {
        [fieldName]: fieldValue,
      },
    });
    if (records.length > 0) {
      return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: records });
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    if (err instanceof Sequelize.Error) {
      return res.status(serviceResponse.badRequest).json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};


/**
 * Retrieve all Banner  details from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.getAll= async function(req, res) {
  try {
    const maxLimit = 50;
    let { page, pageSize } = req.query;
    page = page ? page : 1;
    let offset = 0;
    if (page && pageSize) {
      pageSize = pageSize <= maxLimit ? pageSize : maxLimit;
      offset = (page - 1) * pageSize;
    }

    const { count, rows } = await Registration.findAndCountAll({
      distinct: true,
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: Category,
          attributes: ['id', 'title', 'image_path', 'rank', 'category_type'], 
          through: { attributes: [], },
        },
      ],
    });
    if (count > 0) {
      return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, totalRecords: count, data: rows });
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    console.error('Error retrieving data:', err);
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Search Business  details by fieldName and  fieldValue from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.searchBusiness = async function (req, res) {
  try {
    const { fieldName, fieldValue } = req.params;
    if (!BusinessDetail.rawAttributes[fieldName]) {
      return res.status(serviceResponse.badRequest).json({ error: serviceResponse.fieldNotExistMessage });
    }
    const records = await BusinessDetail.findAll({
      where: {
        [fieldName]: fieldValue,
      },
    });
    if (records.length > 0) {
      return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: records });
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    if (err instanceof Sequelize.Error) {
      return res.status(serviceResponse.badRequest).json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};
