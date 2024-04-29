/**
 * @swagger
 * tags:
 *   name: AddPages
 *   description: APIs for managing add pages
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AddPage:
 *       type: object
 *       properties:
 *         page_title:
 *           type: string
 *           maxLength: 50
 *         page_content:
 *           type: string
 *           maxLength: 500
 *         status:
 *           type: boolean
 *         created_by:
 *           type: number
 *         updated_by:
 *           type: number
 */

/**
 * @swagger
 * /api/page:
 *   post:
 *     summary: Create a new page cms Record
 *     tags: [AddPages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddPage'
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
 *                   $ref: '#/components/schemas/AddPage'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/page/{id}:
 *   put:
 *     summary: Update an page Record
 *     tags: [AddPages]
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
 *         description: ID of the add page record to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddPage'
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
 *                   $ref: '#/components/schemas/AddPage'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/page/{id}:
 *   delete:
 *     summary: Delete an page Record
 *     tags: [AddPages]
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
 *         description: ID of the add page record to delete
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
 *                   $ref: '#/components/schemas/AddPage'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/page/{id}:
 *   get:
 *     summary: Get an page Record by ID
 *     tags: [AddPages]
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
 *         description: ID of the add page record to retrieve
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
 *                   $ref: '#/components/schemas/AddPage'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/page:
 *   get:
 *     summary: Get all page Records
 *     tags: [AddPages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page for Pagination
 *         schema:
 *           type: integer
 *       - name: pageSize
 *         in: query
 *         description: Page Size to show records on the Page for Pagination
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
 *                 totalRecords:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AddPage'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/page/search/{fieldName}/{fieldValue}:
 *   get:
 *     summary: Search page Records by fieldName and fieldValue
 *     tags: [AddPages]
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
 *         description: OK
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
 *                     $ref: '#/components/schemas/AddPage'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
