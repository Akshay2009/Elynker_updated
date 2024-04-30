/**
 * @swagger
 * tags:
 *   name: System Modules
 *   description: API endpoints for managing system modules
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     SystemModule:
 *       type: object
 *       properties:
 *         module_name:
 *           type: string
 *         is_active:
 *           type: boolean
 *         created_by:
 *           type: number
 *         updated_by:
 *           type: number
 *       required:
 *         - module_name
 *         - created_by
 *         - updated_by
 */

/**
 * @swagger
 * /api/systemmodules:
 *   post:
 *     summary: Create a new system module
 *     tags: [System Modules]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Access token for authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SystemModule'
 *     responses:
 *       '201':
 *         description: System module created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SystemModule'
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized - Access token is missing or invalid
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/systemmodules/{id}:
 *   get:
 *     summary: Get a system module by ID
 *     tags: [System Modules]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: false
 *         description: Access token for authentication
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the system module
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: System module retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SystemModule'
 *       '404':
 *         description: System module not found
 *       '401':
 *         description: Unauthorized - Access token is missing or invalid
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/systemmodules:
 *   get:
 *     summary: Get all system modules
 *     tags: [System Modules]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: false
 *         description: Access token for authentication
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page for pagination
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: System modules retrieved successfully
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
 *                     $ref: '#/components/schemas/SystemModule'
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized - Access token is missing or invalid
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/systemmodules/{id}:
 *   put:
 *     summary: Update a system module by ID
 *     tags: [System Modules]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Access token for authentication
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the system module
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SystemModule'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: System module updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SystemModule'
 *       '404':
 *         description: System module not found
 *       '401':
 *         description: Unauthorized - Access token is missing or invalid
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/systemmodules/{id}:
 *   delete:
 *     summary: Delete a system module by ID
 *     tags: [System Modules]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Access token for authentication
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the system module
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: System module deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SystemModule'
 *       '404':
 *         description: System module not found
 *       '401':
 *         description: Unauthorized - Access token is missing or invalid
 *       '500':
 *         description: Internal Server Error
 */
