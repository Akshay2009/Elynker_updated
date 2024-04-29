/**
 * @swagger
 * tags:
 *   name: Vendor Reviews
 *   description: API endpoints for managing vendor reviews
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     VendorReview:
 *       type: object
 *       properties:
 *         review_description:
 *           type: string
 *         review_star:
 *           type: integer
 *         created_by:
 *           type: number
 *         image_path:
 *           type: string
 *         registrationId:
 *           type: integer
 *       required:
 *         - review_description
 *         - review_star
 *         - created_by
 *         - registrationId
 * /api/reviews/vendors:
 *   post:
 *     summary: Create vendor reviews
 *     tags: [Vendor Reviews]
 *     parameters:
 *         - name: x-access-token
 *           in: header
 *           description: Access token for authentication
 *           required: true
 *           schema:
 *             type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorReview'
 *     responses:
 *       '201':
 *         description: Vendor reviews created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/VendorReview'
 *       '400':
 *           description: Bad request
 *       '401':
 *           description: Unauthorized - Access token is missing or invalid
 *       '404':
 *           description: Registration not found
 *       '500':
 *           description: Internal Server Error
 *   get:
 *     summary: Get all vendor reviews
 *     tags: [Vendor Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *         - name: x-access-token
 *           in: header
 *           description: Access token for authentication
 *           required: true
 *           schema:
 *             type: string
 *         - name: page
 *           in: query
 *           description: Page for pagination
 *           schema:
 *             type: integer
 *         - name: pageSize
 *           in: query
 *           description: Page Size to show records on the Page for pagination
 *           schema:
 *             type: integer
 *     responses:
 *       '200':
 *         description: Vendor reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 totalRecords:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VendorReview'
 *       '400':
 *           description: Bad request
 *       '401':
 *           description: Unauthorized - Access token is missing or invalid
 *       '500':
 *           description: Internal Server Error
 */

/**
 * @swagger
 * /api/reviews/vendors/{registrationId}:
 *   get:
 *     summary: Get vendor reviews by registration ID
 *     tags: [Vendor Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *         - name: x-access-token
 *           in: header
 *           description: Access token for authentication
 *           required: true
 *           schema:
 *             type: string
 *         - name: registrationId
 *           in: path
 *           description: Registration ID of vendor
 *           required: true
 *           schema:
 *             type: integer
 *     responses:
 *       '200':
 *         description: Vendor reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VendorReview'
 *       '404':
 *           description: No vendor reviews found for the registration ID
 *       '401':
 *           description: Unauthorized - Access token is missing or invalid
 *       '500':
 *           description: Internal Server Error
 */
