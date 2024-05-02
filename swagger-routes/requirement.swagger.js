/**
 * @swagger
 * tags:
 *   name: Requirements
 *   description: APIs for managing requirements
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Requirement:
 *       type: object
 *       properties:
 *         product_type:
 *           type: integer
 *           enum: [1, 2]
 *         product_service_name:
 *           type: string
 *           maxLength: 100
 *         category:
 *           type: string
 *           maxLength: 100
 *         order_quantity:
 *           type: number
 *           format: float
 *         location:
 *           type: string
 *           maxLength: 100
 *         description:
 *           type: string
 *           maxLength: 500
 *         budget:
 *           type: number
 *           format: float
 *         name:
 *           type: string
 *           maxLength: 100
 *         comments:
 *           type: string
 *           maxLength: 500
 *         status:
 *           type: string
 *           enum: [pending, fulfilled, hold]
 *         mobile_number:
 *           type: string
 *           minLength: 10
 *           maxLength: 10
 *         created_by:
 *           type: number
 *         updated_by:
 *           type: number
 *         registrationId:
 *           type: number
 */

/**
 * @swagger
 * /api/customer/requirement:
 *   post:
 *     summary: Create a new Requirement Record
 *     tags: [Requirements]
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
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Requirement'
 *     responses:
 *       201:
 *         description: Created
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
 *                     $ref: '#/components/schemas/Requirement'
 *       400:
 *         description: Bad Request
 *       '401':
 *           description: Unauthorized - Access token is missing or invalid
 *       '500':
 *           description: Internal Server Error
 */

/**
 * @swagger
 * /api/customer/requirement/{id}:
 *   put:
 *     summary: Update a Requirement Record
 *     tags: [Requirements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: ID of the requirement record to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Requirement'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Requirement'
 *       404:
 *         description: Not Found
 *       '401':
 *           description: Unauthorized - Access token is missing or invalid
 *       '500':
 *           description: Internal Server Error
 */

/**
 * @swagger
 * /api/customer/requirement/{id}:
 *   delete:
 *     summary: Delete a Requirement Record
 *     tags: [Requirements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: ID of the requirement record to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Requirement'
 *       404:
 *         description: Not Found
 *       '401':
 *           description: Unauthorized - Access token is missing or invalid
 *       '500':
 *           description: Internal Server Error
 */

/**
 * @swagger
 * /api/customer/requirement/{id}:
 *   get:
 *     summary: Get a Requirement Record by ID
 *     tags: [Requirements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: ID of the requirement record to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Requirement'
 *       404:
 *         description: Not Found
 *       '401':
 *           description: Unauthorized - Access token is missing or invalid
 *       '500':
 *           description: Internal Server Error
 */

/**
 * @swagger
 * /api/customer/requirement:
 *   get:
 *     summary: Get all Requirement Records
 *     tags: [Requirements]
 *     parameters:
 *         - name: x-access-token
 *           in: header
 *           description: Access token for authentication
 *           required: true
 *           schema:
 *             type: string
 *         - name: page
 *           in: query
 *           description: Page for Pagination
 *           schema:
 *             type: integer
 *         - name: pageSize
 *           in: query
 *           description: Page Size to show records on the Page for Pagination
 *           schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
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
 *                     $ref: '#/components/schemas/Requirement'
 *       404:
 *         description: Not Found
 *       '401':
 *           description: Unauthorized - Access token is missing or invalid
 *       '500':
 *           description: Internal Server Error
 */

/**
 * @swagger
 * /api/customer/requirement/search/{fieldName}/{fieldValue}:
 *   get:
 *     summary: Search Requirement Records by fieldName and fieldValue
 *     tags: [Requirements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: fieldName
 *         description: Name of the field to search by
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: fieldValue
 *         description: Value of the field to search for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Records Found
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
 *                     $ref: '#/components/schemas/Requirement'
 *       404:
 *         description: Not Found
 */