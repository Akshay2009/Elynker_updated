const db = require('../models');
const path = require('path');
const Product = db.product;
const Registration = db.registration;
const Category = db.category;
const parseCSV = require('./csvParser');
const fs = require('fs');
const axios = require('axios');

const { Op } = require('sequelize');
require('dotenv').config();
const PRODUCT_IMAGE_PATH = path.join(process.env.PRODUCT_IMAGE_PATH);
const serviceResponse = require('../config/serviceResponse');
const { log } = require('util');

/**
 method to generate unique SKU in form SKU_****
 * @return { string } SKU is returned
 */
function generateUniqueSKU() {
  return 'SKU_' + Date.now().toString() + Math.floor(Math.random() * 1000);
}

/**
 * 
 * @param {*} imageUrl 
 * @param {*} imageName 
 */
async function downloadImage(imageUrl, imageName) {
  try {
    // Fetch the image using axios
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // Specify the path where the image will be stored
    const imagePath = path.join(__dirname, '../..', PRODUCT_IMAGE_PATH, '/', imageName);

    // Write the image to the file system
    fs.writeFileSync(imagePath, Buffer.from(response.data));

    console.log(`Image downloaded and stored at: ${imagePath}`);
  } catch (error) {
    console.error('Error downloading the image:', error.message);
  }
}


/**
 * Controller function to get all the Product record .
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.getAllProducts = async function(req, res) {
  try {
    const maxLimit = 50;
    let { page, pageSize } = req.query;
    page = page ? page : 1;
    let offset = 0;
    if (page && pageSize) {
      pageSize = pageSize <= maxLimit ? pageSize : maxLimit;
      offset = (page - 1) * pageSize;
    }

    const { count, rows } = await Product.findAndCountAll({
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
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Controller function to a Product record based on sku.
 * sku is passed in params
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.getProductBySKU = async function (req, res) {
  const sku = req.params.sku;
  try {
    const products = await Product.findOne({
      where: {
        sku: sku,
      },
    });
    if (products) {
      return res.status(serviceResponse.ok).json(products);
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (error) {
    return res.status(serviceResponse.internalServerError).json({ message: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Controller function to create Product records based on CSV file passed.
 * multer is used.
 * This controller also updates the business_type on Registration Table.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.createProduct = async function (req, res) {
  try {
    const { type, registrationId, created_by, updated_by, } = req.body;
    if (!req.files['csvFilePath']) {
      return res.status(serviceResponse.badRequest).json({ error: 'Please Provide CSV' });
    }
    if (!registrationId) {
      return res.status(serviceResponse.badRequest).json({ error: 'Registration ID Not provided' });
    }
    if (!type) {
      return res.status(serviceResponse.badRequest).json({ error: 'Type not Provided - Product/Service' });
    }

    let categoryIds;

    if (req.files && req.files['csvFilePath'][0].path) {
      const csvData = await parseCSV(req.files['csvFilePath'][0].path);

      for (const row of csvData) {
        const productImages = row.product_images ? row.product_images.split(',') : [];
        const productArray = [];
        for (let j = 0; j < productImages.length; j++) {
          const imageUrl = productImages[j];
          // let imageName = registrationId+row.title+'image'+j; // Replace with the desired image name
          // imageName = imageName+imageUrl.substring(imageUrl.lastIndexOf("."));
          const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
          productArray.push(imageName);
          downloadImage(imageUrl, imageName);
        }


        let catIdArray;
        // Split comma-separated category IDs into an array
        const rowCategoryIdsArray = row.category_id ? row.category_id.split(',') : [];
        if (rowCategoryIdsArray.length > 0) {
          catIdArray = rowCategoryIdsArray;
          categoryIds = rowCategoryIdsArray.join(',');
        }

        if (row.sku) {
          const [product, created] = await Product.findOrCreate({
            where: { sku: row.sku },
            defaults: {
              title: row.title,
              description: row.description,
              type: type,
              registrationId,
              budget: row.budget,
              moq: row.moq,
              category_id: categoryIds,
              default_image: productArray[0],
              product_images: productArray.join(','),
              created_by,
              updated_by,
            },
          });

          if (!created) {
            // If the product already existed, update the fields
            await product.update({
              title: row.title,
              description: row.description,
              type: type,
              registrationId,
              budget: row.budget,
              moq: row.moq,
              category_id: categoryIds,
              default_image: productArray[0],
              product_images: productArray.join(','),
              created_by,
              updated_by,
            });
          }
          // Find categories by IDs
          const categories = await Category.findAll({
            where: {
              id: catIdArray,
            },
          });

          // Update associations
          await product.setCategories(categories);
        }
      }

      return res.status(serviceResponse.saveSuccess).json({ message: 'Products Data inserted successfully using CSV' });
    } else {
      return res.status(serviceResponse.badRequest).json({ message: 'CSV file not provided' });
    }
  } catch (error) {
    console.error(error);
    return res.status(serviceResponse.internalServerError).json({ message: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Controller function to upload Product Images.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.createProductsImages = async function (req, res) {
  try {
    return res.status(200).json({ message: 'Images Uploaded Successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error ' + error.message });
  }
};

/**
 * Controller function to create Product Single Record.
 * multer is used to upload images
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.createProductsSingleRecord = async function (req, res) {
  try {
    const { type, registrationId, title, description, budget, moq, category_id, unit, year_of_exp,
      portfolio_link, created_by, updated_by, } = req.body;
    if (!req.files['images']) {
      return res.status(serviceResponse.badRequest).json({ error: 'Please Provide Product Images' });
    }
    if (!registrationId) {
      return res.status(serviceResponse.badRequest).json({ error: 'Registration ID Not provided' });
    }
    if (!category_id) {
      return res.status(serviceResponse.badRequest).json({ error: 'No category Provided' });
    }
    if (!type) {
      return res.status(serviceResponse.badRequest).json({ error: 'Type not Provided - Product/Service' });
    }
    const regRecord = await Registration.findOne({
      where: { id: registrationId },
    });
    if (!regRecord) {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.registrationNotFound });
    }
    const imageFileNames = req.files['images'].map((file) => path.basename(file.path));
    const sku = generateUniqueSKU();
    const productImagesString = imageFileNames.join(',');
    // Split comma-separated category IDs into an array
    const categoryIdsArray = category_id.split(',');
    const categories = await Category.findAll({
      where: {
        id: categoryIdsArray,
      },
    });
    if (categories.length == 0) {
      return res.status(serviceResponse.badRequest).json({ error: 'No category with this id' });
    }

    const catArray = [];
    categories.forEach((cat) => {
      catArray.push(cat.id);
    });
    const product = await Product.create({
      title: title,
      description: description,
      sku: sku,
      type: type,
      registrationId,
      year_of_exp,
      portfolio_link,
      category_id: catArray.join(','),
      budget: budget,
      moq: moq,
      unit: unit,
      default_image: imageFileNames[0],
      product_images: productImagesString,
      created_by,
      updated_by,
    });
    if (product) {
      let topLevelCat = await getCategoryTopLevel(catArray.join(','));
      // Associate the Registration with top level Category
      await regRecord.addCategories(topLevelCat);
      // Associate the product with categories
      await product.addCategories(categories);
      return res.status(serviceResponse.saveSuccess).json(product);
    } else {
      return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorCreatingRecord });
    }
  } catch (error) {
    return res.status(serviceResponse.internalServerError).json({ message: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Controller function to update a Product Single Record.
 * multer is used to upload images
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.updateProducts = async function (req, res) {
  try {
    const sku = req.params.sku;
    const { title, type, description, budget, moq, category_id, registrationId, unit, year_of_exp, portfolio_link, created_by, updated_by } = req.body;
    if (!registrationId) {
      return res.status(serviceResponse.badRequest).json({ error: 'Registration ID Not provided' });
    }
    if (!category_id) {
      return res.status(serviceResponse.badRequest).json({ error: 'No category Provided' });
    }
    if (type != 1 && type != 2) {
      return res.status(serviceResponse.badRequest).json({ error: 'Type must be either 1 or 2' });
    }
    const regRecord = await Registration.findOne({
      where: { id: registrationId },
    });
    if (!regRecord) {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.registrationNotFound });
    }
    // Split comma-separated category IDs into an array
    const categoryIdsArray = category_id.split(',');
    const categories = await Category.findAll({
      where: {
        id: categoryIdsArray,
      },
    });
    if (categories.length == 0) {
      return res.status(serviceResponse.badRequest).json({ error: 'No category with this id' });
    }

    const catArray = [];
    categories.forEach((cat) => {
      catArray.push(cat.id);
    });

    let productImagesString;
    let imageFileNames;

    const product_details = {
      title,
      description,
      budget,
      moq,
      type,
      year_of_exp,
      portfolio_link,
      unit: unit,
      category_id: catArray.join(','),
      registrationId: registrationId,
      created_by,
      updated_by,
    };
    const existingProduct = await Product.findOne({ where: { sku: sku } });
    if (!existingProduct) {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
    const existingProductImages = existingProduct.product_images.split(',');
    let existingProductImagesString;
    if (existingProductImages.join(',').length == 0) {
      existingProductImagesString = '';
    } else {
      existingProductImagesString = existingProductImages.join(',');
    }


    if (req.files['images']) { // if images are uploaded then then update product_images and default_image field
      imageFileNames = req.files['images'].map((file) => path.basename(file.path));
      productImagesString = imageFileNames.join(',');
      if (existingProductImages.join(',').length === 0) {
        product_details.default_image = imageFileNames[0];
        product_details.product_images = productImagesString;
      } else {
        product_details.default_image = existingProductImages[0];
        product_details.product_images = existingProductImagesString + ',' + productImagesString;
      }
    }
    // else{
    //     product_details.default_image = "";
    //     product_details.product_images = "";
    //     const existingProductImages = existingProduct.product_images.split(',');
    //     for( let i=0;i<existingProductImages.length;i++){
    //         fs.unlinkSync(path.join(__dirname, '../..', PRODUCT_IMAGE_PATH,'/',existingProductImages[i]));
    //     }
    // }

    const [rowUpdated, productUpdated] = await Product.update(product_details, {
      where: {
        sku: sku,
      },
      returning: true,
    });

    if (rowUpdated > 0) {
      // Update associations
      await productUpdated[0].setCategories(categories);
      return res.status(serviceResponse.ok).json(productUpdated[0]);
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};

module.exports.getProductByRegistrationId = async function (req, res) {
  const registrationId = req.params.registrationId;
  try {
    const products = await Product.findAll({
      where: {
        registrationId: registrationId,
      },
    });
    if (products.length > 0) {
      return res.status(serviceResponse.ok).json(products);
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (error) {
    return res.status(serviceResponse.internalServerError).json({ message: serviceResponse.internalServerErrorMessage });
  }
};

module.exports.deleteProductBySku = async function (req, res) {
  try {
    const sku = req.params.sku;
    const productToDelete = await Product.findOne({
      where: {
        sku: sku,
      },
    });
    if (!productToDelete) {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
    if (productToDelete) {
      const existingProductImages = productToDelete.product_images.split(',');
      for (let i = 0; i < existingProductImages.length; i++) {
        fs.unlinkSync(path.join(__dirname, '../..', PRODUCT_IMAGE_PATH, '/', existingProductImages[i]));
      }
    }
    const deletedProduct = await Product.destroy({
      where: {
        sku: sku,
      },
      returning: true,
      raw: true,
    });
    if (deletedProduct) {
      return res.status(serviceResponse.ok).json({ message: serviceResponse.deletedMessage, product: productToDelete });
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};

module.exports.delProductImages = async function (req, res) {
  try {
    const { product_id } = req.params;
    const { image_name } = req.body;
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
    const productArray = product.product_images.split(',');
    const productArrayUpdated = productArray.filter((product) => product !== image_name);

    if (productArray.length === productArrayUpdated.length) {
      return res.status(400).json({ error: 'Image name provided not present on this Product' });
    }
    const [rowUpdated, productUpdated] = await Product.update({
      default_image: productArrayUpdated[0] || '',
      product_images: productArrayUpdated.join(',') || '',
    }, {
      where: {
        id: product_id,
      },
      returning: true,
    });
    if (rowUpdated > 0) {
      fs.unlinkSync(path.join(__dirname, '../..', PRODUCT_IMAGE_PATH, '/', image_name));
      return res.status(serviceResponse.ok).json({ message: serviceResponse.updatedMessage, product: productUpdated[0] });
    } else {
      return res.status(serviceResponse.badRequest).json({ error: 'Error in deleting Product Images' });
    }
  } catch (err) {
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};

module.exports.getParentCategory = async function (req, res) {
  try {
    const topLevel = [];
    
    const registrationId = req.params.registrationId;

    const products = await Product.findAll({
      where: {
        registrationId: registrationId,
      },
    });

    if (products.length > 0) {
      const uniqueIds = new Set();
      const promises = products.map(async (item) => {
        const result = await getCategoryTopLevel(parseInt(item.category_id));
        return result.dataValues;
      });

      const results = await Promise.all(promises);

      results.forEach((result) => {
        if (!uniqueIds.has(result.id)) {
          uniqueIds.add(result.id);
          topLevel.push(result);
        }
      });

      return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: topLevel });
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};


/**
 * Search User Banner details by fieldName and  fieldValue from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.search = async function (req, res) {
  try {
    const { fieldName, fieldValue } = req.params;
    if (!Product.rawAttributes[fieldName]) {
      return res.status(serviceResponse.badRequest).json({ error: serviceResponse.fieldNotExistMessage });
    }
    const records = await Product.findAll({
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


const getCategoryTopLevel = async (categoryId) => {
  let category = await Category.findByPk(categoryId);

  if (!category) {
    throw new Error('Category not found');
  }
  
  const traverseUp = async (category) => {
    // If the category has no parent, it's the top-level category
    if (!category.parent_id) {
      return category;
    }
    
    // Retrieve the parent category
    const parentCategory = await Category.findByPk(category.parent_id);
    
    // If the parent category doesn't exist, return current category
    if (!parentCategory) {
      return category;
    }
    return traverseUp(parentCategory);
  };
  
  return traverseUp(category);
};