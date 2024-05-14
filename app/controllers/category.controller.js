const db = require('../models');
const { Sequelize } = require('sequelize');
const Category = db.category;
const fs = require('fs');
const path = require('path');
const Product = db.product;
require('dotenv').config();
const CATEGORY_LOGO_PATH = path.join(process.env.CATEGORY_LOGO_PATH);
const serviceResponse = require('../config/serviceResponse');

/**
 * Controller function to get all the Category record .
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.getAllCategory = async function(req, res) {
  try {
    const maxLimit = 50;
    let { page, pageSize } = req.query;
    page = page ? page : 1;
    let offset = 0;
    if (page && pageSize) {
      pageSize = pageSize <= maxLimit ? pageSize : maxLimit;
      offset = (page - 1) * pageSize;
    }
    
    const { count, rows } = await Category.findAndCountAll({
      limit: pageSize,
      offset: offset,
      include: [{
        model: Category,
        as: 'children',
        attributes: [], // Exclude child attributes
        required: false // Left join to include categories without children
      }],
      attributes: [
        'id',
        'title',
        'category_type',
        'description',
        'image_path',
        'banner_image',
        'icon_path',
        'parent_id',
        'rank',
        'status',
        'created_by',
        'updated_by',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('children.id')), 'children_count']
      ],
      raw: true,
      subQuery: false,
      group: ['categories.id'],
      order: [['rank', 'ASC'], ['createdAt', 'ASC']]
    });
    if (count.length > 0) {
      return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, totalRecords: count.length, data: rows });
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
    
  } catch (err) {
    console.log(err);
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Controller function to create a Category record .
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.createCategory = async function (req, res) {
  try {
    const { title, description, parent_id, category_type, status, rank, created_by, updated_by } = req.body;
    let imagePath;
    let bannerImage;
    let iconPath;
    if (req.files['image_path']) {
      // Extract file names
      imagePath = req.files['image_path'][0].filename;
    }
    if (req.files['banner_image']) {
      bannerImage = req.files['banner_image'][0].filename;
    }
    if (req.files['icon_path']) {
      iconPath = req.files['icon_path'][0].filename;
    }
    if (parent_id) {
      const record = await Category.findOne({ where: { id: parent_id } });
      if (record) {
        const category = await Category.create({
          title,
          description,
          parent_id: parent_id,
          category_type,
          image_path: imagePath,
          banner_image: bannerImage,
          icon_path: iconPath,
          status: status,
          rank: rank,
          created_by: created_by,
          updated_by: updated_by,
        });

        if (category) {
          return res.status(serviceResponse.saveSuccess).json({ message: serviceResponse.createdMessage, data: category });
        } else {
          return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorCreatingRecord });
        }
      } else {
        if (imagePath) {
          fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', imagePath));
        }
        if (bannerImage) {
          fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', bannerImage));
        }
        if (iconPath) {
          fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', iconPath));
        }
        return res.status(serviceResponse.notFound).json({ error: serviceResponse.noCategoryParentMessage });
      }
    } else {
      const newCategory = await Category.create({
        title,
        description,
        parent_id: null,
        category_type,
        image_path: imagePath,
        banner_image: bannerImage,
        icon_path: iconPath,
        status: status,
        rank: rank,
        created_by: created_by,
        updated_by: updated_by,
      });

      if (newCategory) {
        return res.status(serviceResponse.saveSuccess).json({ message: serviceResponse.createdMessage, data: newCategory });
      } else {
        return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorCreatingRecord });
      }
    }
  } catch (err) {
    if (err instanceof Sequelize.Error) {
      return res.status(serviceResponse.badRequest).json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Controller function to create a Category record by id.
 * categoryId is passed in params
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.getCategoryById = async function (req, res) {
  try {
    const categoryId = req.params.categoryId;
    const categories = await Category.findOne({
      where: {
        id: categoryId,
      },
    });
    if (categories) {
      return res.status(serviceResponse.ok).json({ message: serviceResponse.createdMessage, data: categories });
    } else {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
  } catch (err) {
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};


/**
 * Controller function to update a Category record .
 * categoryId is passed in params
 * title, description, parent_id,category_type is passed in body
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.updateCategory = async function (req, res) {
  try {
    const categoryId = req.params.categoryId;
    const { title, description, parent_id, category_type, status, rank, created_by, updated_by } = req.body;
    let imagePath;
    let bannerImage;
    let iconPath;
    if (req.files['image_path']) {
      // Extract file names
      imagePath = req.files['image_path'][0].filename;
    }
    if (req.files['banner_image']) {
      bannerImage = req.files['banner_image'][0].filename;
    }
    if (req.files['icon_path']) {
      iconPath = req.files['icon_path'][0].filename;
    }

    if (parent_id) {
      const record = await Category.findOne({ where: { id: parent_id } });
      if (record) {
        const existingCategory = await Category.findByPk(categoryId);
        if (!existingCategory) {
          if (imagePath) {
            fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', imagePath));
          }
          if (bannerImage) {
            fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', bannerImage));
          }
          if (iconPath) {
            fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', iconPath));
          }
          return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
        if (existingCategory) {
          if (imagePath) {
            if (existingCategory.image_path) {
              fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', existingCategory.image_path));
            }
          } else {
            // if (existingCategory.image_path) {
            //     fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH,'/',existingCategory.image_path));
            // }
            imagePath = existingCategory.image_path;
          }
          if (bannerImage) {
            if (existingCategory.banner_image) {
              fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', existingCategory.banner_image));
            }
          } else {
            // if (existingCategory.banner_image) {
            //     fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH,'/',existingCategory.banner_image));
            // }
            bannerImage = existingCategory.banner_image;
          }
          if (iconPath) {
            if (existingCategory.icon_path) {
              fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', existingCategory.icon_path));
            }
          } else {
            // if (existingCategory.banner_image) {
            //     fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH,'/',existingCategory.banner_image));
            // }
            iconPath = existingCategory.icon_path;
          }
        }


        const [rowCount, updatedCategory] = await Category.update({
          title,
          description,
          parent_id: parent_id,
          category_type,
          image_path: imagePath,
          banner_image: bannerImage,
          icon_path: iconPath,
          status: status,
          rank: rank,
          created_by: created_by,
          updated_by: updated_by,
        }, {
          where: {
            id: categoryId,
          },
          returning: true,
        });

        if (rowCount > 0) {
          return res.status(serviceResponse.ok).json({ message: serviceResponse.updatedMessage, data: updatedCategory[0] });
        } else {
          return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
      } else {
        if (imagePath) {
          fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', imagePath));
        }
        if (bannerImage) {
          fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', bannerImage));
        }
        if (iconPath) {
          fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', iconPath));
        }
        return res.status(serviceResponse.notFound).json({ error: serviceResponse.noCategoryParentMessage });
      }
    } else {
      const existingCategory = await Category.findByPk(categoryId);
      if (!existingCategory) {
        if (imagePath) {
          fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', imagePath));
        }
        if (bannerImage) {
          fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', bannerImage));
        }
        if (iconPath) {
          fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', iconPath));
        }
        return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
      }
      if (existingCategory) {
        if (imagePath) {
          if (existingCategory.image_path) {
            fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', existingCategory.image_path));
          }
        } else {
          // if (existingCategory.image_path) {
          //     fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', existingCategory.image_path));
          // }
          imagePath = existingCategory.image_path;
        }
        if (bannerImage) {
          if (existingCategory.banner_image) {
            fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', existingCategory.banner_image));
          }
        } else {
          // if (existingCategory.banner_image) {
          //     fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', existingCategory.banner_image));
          // }
          bannerImage = existingCategory.banner_image;
        }
        if (iconPath) {
          if (existingCategory.icon_path) {
            fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', existingCategory.icon_path));
          }
        } else {
          // if (existingCategory.banner_image) {
          //     fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', existingCategory.banner_image));
          // }
          iconPath = existingCategory.icon_path;
        }
      }

      const [rowCount, updatedCategory] = await Category.update({
        title,
        description,
        category_type,
        image_path: imagePath,
        banner_image: bannerImage,
        icon_path: iconPath,
        status: status,
        rank: rank,
        created_by: created_by,
        updated_by: updated_by,
      }, {
        where: {
          id: categoryId,
        },
        returning: true,
      });
      if (rowCount > 0) {
        return res.status(serviceResponse.ok).json({ message: serviceResponse.updatedMessage, data: updatedCategory[0] });
      } else {
        return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
      }
    }
  } catch (err) {
    if (err instanceof Sequelize.Error) {
      return res.status(serviceResponse.badRequest).json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};


/**
 * Controller function to create multiple Category record .
 * parent_id is passed in params
 * array of object is passed in body
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.createMultipleCategory = async function (req, res) {
  try {
    const parent_id = req.params.parent_id;
    const arr = req.body;
    if (!arr.length) {
      return res.status(serviceResponse.badRequest).json({ error: 'Please provide your category data in json array[]!' });
    }
    if (parent_id) {
      const record = await Category.findOne({ where: { id: parent_id } });

      if (record) {
        const updatedArr = arr.map((item) => {
          return {
            ...item,
            parent_id: parent_id, // Add parent_id
          };
        });
        const result = await Category.bulkCreate(
          updatedArr,
          {
            updateOnDuplicate: ['title', 'description', 'parent_id', 'category_type'],
          },
        );
        if (result) {
          return res.status(serviceResponse.saveSuccess).json({ message: serviceResponse.createdMessage, data: result });
        } else {
          return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorCreatingRecord });
        }
      } else {
        return res.status(serviceResponse.notFound).json({ error: serviceResponse.noCategoryParentMessage });
      }
    }
  } catch (err) {
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Controller function to get all subcategories of a category .
 * parent_id is passed in params
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.getSubcategories = async function (req, res) {
  try {
    const parent_id = req.params.parent_id;
    const categories = await Category.findAll({
      where: {
        parent_id: parent_id,
      },
    });
    if (categories.length > 0) { // if subcategories exist then simply return sub-categories
      return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, subCategories: categories, products: [] });
    } else {// if no subcategories then return Product having this id as category_id
      const products = await Product.findAll({
        where: {
          category_id: {
            [Sequelize.Op.like]: `%${parent_id}%`,
          },
        },
      });
      return res.status(serviceResponse.ok).json({ message: serviceResponse.errorNotFound, subCategories: [], products: products });
    }
  } catch (err) {
    return res.status(500).json({ error: serviceResponse.internalServerErrorMessage });
  }
};
/**
 * Controller function to Delete categories of a category .
 * parent_id is passed in params
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.delcategories = async function (req, res) {
  try {
    const category_id = req.params.category_id;
    const categoryToDelete = await Category.findByPk(category_id);
    if (!categoryToDelete) {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
    if (categoryToDelete) {
      if (categoryToDelete.image_path) {
        fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', categoryToDelete.image_path));
      }
      if (categoryToDelete.banner_image) {
        fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', categoryToDelete.banner_image));
      }
      if (categoryToDelete.icon_path) {
        fs.unlinkSync(path.join(__dirname, '../..', CATEGORY_LOGO_PATH, '/', categoryToDelete.icon_path));
      }
    }
    const categories = await Category.destroy({
      where: {
        id: category_id,
      },
    });
    if (!categories) {
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    } else {
      return res.status(serviceResponse.ok).json({ message: serviceResponse.deletedMessage, data: categoryToDelete });
    }
  } catch (err) {
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};

/**
 * Search Category details by fieldName and  fieldValue from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.search = async function (req, res) {
  try {
    const { fieldName, fieldValue } = req.params;
    const { status } = req.query;
    if (!Category.rawAttributes[fieldName]) {
      return res.status(serviceResponse.badRequest).json({ error: serviceResponse.fieldNotExistMessage });
    }
    const whereClause = { [fieldName]: fieldValue };
    if (status) {
      whereClause.status = status;
    }
    const categories = await Category.findAll({
      where:whereClause,
    });
    if (categories.length > 0) {
      return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: categories });
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
