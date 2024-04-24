/**
 * @swagger
 * tags:
 *   name: Widgets
 *   description: API endpoints for managing widgets
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Widget:
 *       type: object
 *       properties:
 *         widget_name:
 *           type: string
 *         page_name:
 *           type: string
 *         is_active:
 *           type: boolean
 *         rank:
 *           type: number
 *         updated_by:
 *           type: number
 *       required:
 *         - widget_name
 *         - updated_by
 */
/**
 * @swagger
 * /api/widgets:
 *   post:
 *     summary: Create widgets
 *     tags: [Widgets]
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
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Widget'
 *     responses:
 *       '201':
 *         description: Widgets created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Widget'
 *       '400':
 *           description: Bad request
 *       '401':
 *           description: Unauthorized - Access token is missing or invalid
 *       '500':
 *           description: Internal Server Error
 */
/**
 * @swagger
 * /api/widgets:
 *   get:
 *     summary: Get all widgets
 *     tags: [Widgets]
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
 *           description: Page for Pagination
 *           schema:
 *             type: integer
 *         - name: pageSize
 *           in: query
 *           description: Page Size to show records on the Page for Pagination
 *           schema:
 *             type: integer
 *     responses:
 *       '200':
 *         description: Widgets retrieved successfully
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
 *                     $ref: '#/components/schemas/Widget'
 *       '400':
 *           description: Bad request
 *       '401':
 *           description: Unauthorized - Access token is missing or invalid
 *       '500':
 *           description: Internal Server Error
 */
/**
 * @swagger
 * /api/widgets/{id}:
 *   put:
 *     summary: Update a widget by ID
 *     tags: [Widgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *         - name: x-access-token
 *           in: header
 *           description: Access token for authentication
 *           required: true
 *           schema:
 *             type: string
 *         - name: id
 *           in: path
 *           description: Id of widget
 *           required: true
 *           schema:
 *             type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Widget'
 *     responses:
 *       '200':
 *         description: Widget updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Widget'
 *       '404':
 *           description: No Record found
 *       '401':
 *           description: Unauthorized - Access token is missing or invalid
 *       '500':
 *           description: Internal Server Error
 */
