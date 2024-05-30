/**
 * @swagger
 * tags:
 *   name: AdminTools
 *   description: API endpoints for managing admin tools
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     AdminTool:
 *       type: object
 *       properties:
 *         tools_title:
 *           type: string
 *           maxLength: 50
 *           description: Title of the tool
 *         tools_description:
 *           type: string
 *           maxLength: 255
 *           description: Description of the tool
 *         tools_icon_image:
 *           type: string
 *           description: URL of the tool's icon image
 *         tools_cover_image:
 *           type: string
 *           description: URL of the tool's cover image
 *         is_active:
 *           type: boolean
 *           description: Indicates if the tool is active
 *         service_type:
 *           type: string
 *           maxLength: 50
 *           description: Type of service the tool provides
 *         redirect_to:
 *           type: string
 *           maxLength: 255
 *           description: URL to redirect to
 *         created_by:
 *           type: number
 *           description: ID of the user who created the tool
 *         updated_by:
 *           type: number
 *           description: ID of the user who last updated the tool
 *       required:
 *         - tools_title
 *         - is_active
 */

/**
 * @swagger
 * /api/admin/tools:
 *   post:
 *     summary: Upload tools details from an Excel file
 *     tags: [AdminTools]
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The Excel file to upload
 *     responses:
 *       '200':
 *         description: Tools added or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '401':
 *         description: Unauthorized - Access token is missing or invalid
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/admin/tools:
 *   get:
 *     summary: Get all admin tools
 *     tags: [AdminTools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page for pagination
 *         schema:
 *           type: integer
 *       - name: pageSize
 *         in: query
 *         description: Number of records per page for pagination
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Admin tools retrieved successfully
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
 *                     $ref: '#/components/schemas/AdminTool'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '401':
 *         description: Unauthorized - Access token is missing or invalid
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/admin/tools/{id}:
 *   put:
 *     summary: Update an admin tool by ID
 *     tags: [AdminTools]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the tool to update
 *         required: true
 *         schema:
 *           type: integer
 *       - name: x-access-token
 *         in: header
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminTool'
 *     responses:
 *       '200':
 *         description: Tool updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/AdminTool'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '401':
 *         description: Unauthorized - Access token is missing or invalid
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/admin/tools/{id}:
 *   delete:
 *     summary: Delete an admin tool by ID
 *     tags: [AdminTools]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the tool to delete
 *         required: true
 *         schema:
 *           type: integer
 *       - name: x-access-token
 *         in: header
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Tool deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/AdminTool'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '401':
 *         description: Unauthorized - Access token is missing or invalid
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
