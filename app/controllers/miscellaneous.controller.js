const db = require('../models');
require('dotenv').config();
const User = db.user;
const Registration = db.registration;
const serviceResponse = require('../config/serviceResponse');
const Product = db.product;
const Category = db.category;
const logErrorToFile = require('../logger');
const Sequelize = db.Sequelize;
const FreelancerResume = db.freelancerResume;
const FreelancerBannerProject = db.freelancerBannerProject;
const Certificate = db.certificate;
const BusinessDetail = db.businessDetail;
const Enquiry = db.enquiry;
const SocialLinks = db.sociallinks;
const MembersContacted = db.membersContacted;
const fs = require("fs");
const path = require("path");
const { where } = require('sequelize');
const CardSharing = db.cardSharing;
const CARD_IMAGE_PATH = path.join(
  process.env.CARD_IMAGE_PATH
);
const vendorReviews = db.vendorReviews;

/**
 *Endpoint to get filter vendors details based on type location category rating -----
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.getVendorsByLocation = async (req, res) => {
    try {
        const { type } = req.params;
        const { location, categoryId, rating, sortBy } = req.query;
        
        let whereCondition = {
            registration_type: type,
            status: 'approved',
        };

        if (location) {
            whereCondition.city = Array.isArray(location) ? location : [location];
        }
        let minRatings = [];
        let minRating = 0.0;
        if (rating) {
            minRatings = Array.isArray(rating) ? rating.map(ele => parseFloat(ele)) : [parseFloat(rating)];
            minRating = Math.min(...minRatings);
        }

        let includeOptions = [
            {
                model: User,
                attributes: ['id', 'mobile_number', 'country_code'],
            },
            {
                model: Product,
                attributes: ['id','budget'],
            },
            {
                model: MembersContacted,
                attributes: ['id'],
            }
        ];


        if (categoryId) {
            includeOptions.push({
                model: Category,
                attributes: [],
                through: { attributes: [] }, //  no attributes are selected from the join table
                where: { id: Array.isArray(categoryId) ? categoryId : [categoryId] }
            });
        }
        const vendors = await Registration.findAll({
            where: whereCondition,
            include: includeOptions,
            attributes: [
                'id',
                'name',
                'image_path',
                'last_login',
                'registration_type',
                'city',
                'business_description',
                'whatsapp_number',
                'company_name',
                'education',
                'available_hrs_per_week',

                'service_fee',
                'freelancer_role',
                'freelancer_bio',
                'language',
                'rating',
            ],
            order: [
                sortBy === 'price-low-to-high' ? [{ model: Product }, 'budget', 'ASC'] :
                sortBy === 'price-high-to-low' ? [{ model: Product }, 'budget', 'DESC'] : 
                ['name', 'ASC'] // Sort by name in ascending order
            ].filter(Boolean) // Filter out any null values from the array
        });
        

        const formattedData = vendors.map(vendor => {
            const productCount = vendor.products.length; // Calculate product_count based on the number of products
            const memberCount = vendor.contacted_members.length; // Calculate member_count based on the number of contacted_members
            let minBudget = null;
            if(parseInt(type)===3){ 
                const filteredProducts = vendor.products.filter(product => isFinite(product.budget));
                //Calculate minimum budget only if there are products with finite budget values
                if (filteredProducts.length > 0) {
                    minBudget = Math.min(...filteredProducts.map(product => product.budget));
                }
            }
            return {
                id: vendor.id,
                name: vendor.name,
                company_name: vendor.company_name,
                image_path: vendor.image_path,
                registration_type: vendor.registration_type,
                city: vendor.city,
                business_description: vendor.business_description,
                last_login: vendor.last_login,
                whatsapp_number: vendor.whatsapp_number,
                country_code: vendor.user.dataValues.country_code.substring(1),
                mobile_number: vendor.user.dataValues.mobile_number,
                product_count: productCount,
                rating: vendor.rating,
                member_count: memberCount,
                education: vendor.education,
                available_hrs_per_week: vendor.available_hrs_per_week,
                hourly_rate: minBudget,
                service_fee: vendor.service_fee,
                freelancer_role: vendor.freelancer_role,
                freelancer_bio: vendor.freelancer_bio,
                language: vendor.language,
            };
        });

        // Filter vendors based on the minimum rating
        const filteredVendors = formattedData.filter(vendor => vendor.rating >= minRating && vendor.product_count>0);
        const cities = [...new Set(filteredVendors.map(vendor => vendor.city))];

        if (filteredVendors.length > 0) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: filteredVendors, cities: cities });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }

    } catch (error) {
        console.error("Error fetching vendor types:", error);
        return res.status(serviceResponse.internalServerError).json({ message: serviceResponse.internalServerErrorMessage });
    }
};

/**
 * Get  Registration Records by type 0-for both b2b and freelancer,2-b2b, 3-freelancer
 * End point to get freelancer profile details by registration id--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */

module.exports.vendorsListingAdmin = async function (req, res) {
    try {
        const type = parseInt(req.params.type);
        if (type !== 0 && type !== 2 && type !== 3) {
            return res.status(serviceResponse.badRequest).json({ error: 'Incorrect Type Provided' });
        };

        let whereClause = {};
        if (type === 2) {
            whereClause = { registration_type: 2 };
        } else if (type === 3) {
            whereClause = { registration_type: 3 };
        } else if (type === 0) {
            whereClause = { registration_type: [2, 3] };
        }
        let includeOptions = [
            {
                model: User,
                attributes: ['id', 'mobile_number', 'email'],
            }
        ];
        const maxLimit = 50;
        let { page, pageSize } = req.query;
        page = page ? page : 1;
        let offset = 0;
        if (page && pageSize) {
            pageSize = pageSize <= maxLimit ? pageSize : maxLimit;
            offset = (page - 1) * pageSize;
        }
        const { count, rows } = await Registration.findAndCountAll({
            where: whereClause,
            include: includeOptions,
            limit: pageSize,
            offset: offset,
            attributes: [
                'id',
                'name',
                'registration_type',
                'city',
                'status',
                'company_name',
                'freelancer_role',
                'createdAt',
                'updatedAt',
            ],
            order: [['updatedAt', 'DESC']],
        });
        if (count > 0) {
            const categorizedData = rows.map(entry => {
                const registrationType = entry.registration_type == 2 ? "Business" : "Freelancer";
                let responseData = { 
                    ...entry.toJSON(),
                    registration_type: registrationType 
                };

                if (registrationType === "Business") {
                    delete responseData.freelancer_role;
                } else if (registrationType === "Freelancer") {
                    delete responseData.company_name;
                }
        
                return responseData;
            });
            return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, totalRecords: count, data: categorizedData });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, 'miscellaneous.controller', 'vendorsListing');
            if (err instanceof Sequelize.Error) {
                return res.status(serviceResponse.badRequest).json({ error: err.message });
            }
            return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
}
/**
 * End point to get freelancer profile details by registration id--
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
    module.exports.getFreelancerProfileDetailsByRegId = async function (req, res) {
        try {
            const { reg_id } = req.params;
            let whereCondition = {
                id: reg_id
            };
            let includeOptions = [
                {
                    model: User,
                    attributes: ['id', 'mobile_number', 'email'],
                },
                {
                    model: FreelancerResume,
                    attributes: ['id', 'freelancer_resume'],
                },
                {
                    model: FreelancerBannerProject,
                    attributes: ['id', 'banner_name'],
                },
                {
                    model: Product,
                    attributes: ['id', 'title', 'default_image', 'description', 'budget', 'type'],
                },
                {
                    model: Category,
                    through: { attributes: [] },
                    attributes: ['id', 'title']
                },
                {
                    model: Certificate,
                    attributes: ['id', 'name'],
                },
                {
                    model: BusinessDetail,
                }
            ];
            const vendor = await Registration.findOne({
                where: whereCondition,
                include: includeOptions,
            });

            if (vendor) {
                return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: vendor });
            } else {
                return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
            }
        } catch (err) {
            logErrorToFile.logErrorToFile(err, 'miscellaneous.controller', 'getFreelancerProfileDetailsByRegId');
            if (err instanceof Sequelize.Error) {
                return res.status(serviceResponse.badRequest).json({ error: err.message });
            }
            return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
        }
}

/*
 * End point to get vendor Details by registration id-
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.getVendorByRegId = async function(req, res) {
    try {
        const { reg_id } = req.params;
        let whereCondition = {
            id: reg_id
        };
        let includeOptions = [
            {
                model: Product,
                include:{
                    model: Category,
                    attributes: ['id','title'],
                    through: { attributes: [] },
                }
            },
            {
                model: BusinessDetail,
            },
            {
                model: SocialLinks
            },
            {
                model: MembersContacted,
            }, 
            {
                model: vendorReviews,
            },
        ];
        const vendor = await Registration.findAll({
            where: whereCondition,
            include: includeOptions,
        });

        if (vendor.length>0) {
            // const categories = vendor.flatMap((entry) => {
            //     return entry.products.flatMap((product) => {
            //         return product.categories.map((category) => ({
            //             id: category.id,
            //             title: category.title
            //         }));
            //     });
            // });

            const categoriesMap = new Map();
            vendor.flatMap(entry => entry.products.flatMap(product => product.categories))
                .forEach(category => categoriesMap.set(category.id, { id: category.id, title: category.title }));

            const categories = Array.from(categoriesMap.values());
            // Calculate count of review_stars
            const reviewStarsCount = vendor.reduce((acc, entry) => {
                entry.vendor_reviews
                    .filter(review => review.review_star !== null)
                    .forEach((review) => {
                        acc[review.review_star] = (acc[review.review_star] || 0) + 1;
                    });
                return acc;
            }, {"1":0, "2":0, "3":0, "4":0, "5":0});

            // Mock reviews data
            const returnData = vendor.map((entry)=>{
                const updatedResponse =  {
                    ...entry.toJSON(),
                    reviews: entry.vendor_reviews.map((review) => ({
                        review: review.review_description,
                        review_star: review.review_star,
                        createdAt: review.createdAt,
                        reviewer_user_id: review.reviewer_user_id,
                        image_path:  review.image_path,
                        reviewer_name: review.reviewer_name,
                        reviewer_image_path: review.reviewer_image_path,
                    })),
                    contacted_members: entry.contacted_members.length,
                    categories: categories
                }
                delete updatedResponse.vendor_reviews;
                return updatedResponse;
            });

            const responseObject = {
                message: serviceResponse.getMessage, 
                data: returnData[0],
            }
            if(Object.keys(reviewStarsCount).length > 0){
                
                const totalReviews = Object.values(reviewStarsCount).reduce((total, count) => total + count, 0);
                if(totalReviews>0){
                    responseObject.reviewStarsCount = reviewStarsCount;
                    const reviewStarsPercentages = {};
                    for (const star in reviewStarsCount) {
                        const count = reviewStarsCount[star];
                        const percentage = (count / totalReviews) * 100;
                        reviewStarsPercentages[star] = percentage;
                    }
                    responseObject.reviewStarsPercentages = reviewStarsPercentages;
                }
            }

            
            //Send response with both vendor details and reviews
            return res.status(serviceResponse.ok).json(responseObject);
            
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        logErrorToFile.logErrorToFile(err, 'miscellaneous.controller', 'getVendorByRegId');
        return res.status(serviceResponse.internalServerError).json({ error: 'Internal server error' });
    }
}

//End point to upload card images--

module.exports.cardImageUpload = async function (req, res) {
  try {
    const { posted_by } = req.body;
    let cardImage;
    if (req.files!==undefined && req.files["image"]) {
      cardImage = req.files["image"];
    } else {
      res
        .status(serviceResponse.badRequest)
        .json({ error: "Image not provided" });
    }

    if (cardImage && cardImage.length > 0) {
        const imageUrl = req.protocol + "://" + req.get("host") + CARD_IMAGE_PATH.replace(/\\/g, '/') + "/" + cardImage[0].filename;
      const record = await CardSharing.create({
        image_url: imageUrl, // Corrected to image_url
        image: cardImage[0].filename ,
        posted_by: posted_by,
      });

      if (record) {
        return res.status(serviceResponse.saveSuccess).json({
          message: serviceResponse.createdMessage,
          data: record // Including imageUrl in data
        });
      } else {
        return res
          .status(serviceResponse.badRequest)
          .json({ error: serviceResponse.errorCreatingRecord });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error:serviceResponse.internalServerError + error.message });
  }
};


/*
 * End point to get vendor freelancer Details by registration id-
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} - Promise representing the completion of the retrieval operation.
 */
module.exports.getVendorFreelancerByRegId = async function(req, res) {
    try {
        const { reg_id } = req.params;
        let whereCondition = {
            id: reg_id
        };
        let includeOptions = [
            {
                model: User,
                attributes: ['id', 'mobile_number', 'country_code']
            },
            {
                model: Product,
                include:{
                    model: Category,
                    attributes: ['id','title'],
                    through: { attributes: [] },
                }
            },
            {
                model: FreelancerBannerProject,
            },
            {
                model: FreelancerResume,
            },
            {
                model: Certificate
            },
            {
                model: MembersContacted,
            },
            {
                model: vendorReviews,
            },
        ];
        const vendor = await Registration.findAll({
            where: whereCondition,
            include: includeOptions,
        });

        
        if (vendor.length>0) {
            // const categories = vendor.flatMap((entry) => {
            //     return entry.products.flatMap((product) => {
            //         return product.categories.map((category) => ({
            //             id: category.id,
            //             title: category.title
            //         }));
            //     });
            // });

            const categoriesMap = new Map();
            vendor.flatMap(entry => entry.products.flatMap(product => product.categories))
                .forEach(category => categoriesMap.set(category.id, { id: category.id, title: category.title }));

            const categories = Array.from(categoriesMap.values());
            // Calculate count of review_stars
            const reviewStarsCount = vendor.reduce((acc, entry) => {
                entry.vendor_reviews
                    .filter(review => review.review_star !== null)
                    .forEach((review) => {
                        acc[review.review_star] = (acc[review.review_star] || 0) + 1;
                    });
                return acc;
            }, {"1":0, "2":0, "3":0, "4":0, "5":0});
            let minBudget = null;
            const filteredProducts = vendor[0].products.filter(product => isFinite(product.budget));
            //Calculate minimum budget only if there are products with finite budget values
            if (filteredProducts.length > 0) {
                minBudget = Math.min(...filteredProducts.map(product => product.budget));
            }
            // Mock reviews data
            const returnData = vendor.map((entry)=>{
                const updatedResponse =  {
                    ...entry.toJSON(),
                    reviews: entry.vendor_reviews.map((review) => ({
                        review: review.review_description,
                        review_star: review.review_star,
                        createdAt: review.createdAt,
                        reviewer_user_id: review.reviewer_user_id,
                        image_path:  review.image_path,
                        reviewer_name: review.reviewer_name,
                        reviewer_image_path: review.reviewer_image_path,
                    })),
                    contacted_members: entry.contacted_members.length,
                    categories: categories,
                    hourly_rate: minBudget,
                }
                delete updatedResponse.vendor_reviews;
                return updatedResponse;
            });

            const responseObject = {
                message: serviceResponse.getMessage, 
                data: returnData[0],
            }
            if(Object.keys(reviewStarsCount).length > 0){
                const totalReviews = Object.values(reviewStarsCount).reduce((total, count) => total + count, 0);
                if(totalReviews>0){
                    responseObject.reviewStarsCount = reviewStarsCount;
                    const reviewStarsPercentages = {};
                    for (const star in reviewStarsCount) {
                        const count = reviewStarsCount[star];
                        const percentage = (count / totalReviews) * 100;
                        reviewStarsPercentages[star] = percentage;
                    }
                    responseObject.reviewStarsPercentages = reviewStarsPercentages;
                }
            }

            // Send response with both vendor details and reviews
            return res.status(serviceResponse.ok).json(responseObject);
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        logErrorToFile.logErrorToFile(err, 'miscellaneous.controller', 'getVendorFreelancerByRegId');
        return res.status(serviceResponse.internalServerError).json({ error: 'Internal server error' });
    }
}
