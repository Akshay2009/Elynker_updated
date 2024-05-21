/**
 * @swagger
 * tags:
 *   name: WidgetDetails
 *   description: APIs for managing widget details
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WidgetDetails:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 100
 *         sub_title:
 *           type: string
 *           maxLength: 200
 *         template:
 *           type: string
 *           maxLength: 50
 *         main_image:
 *           type: string
 *           maxLength: 200
 *         thumbnail_image:
 *           type: string
 *           maxLength: 200
 *         button_text:
 *           type: string
 *           maxLength: 200
 *         button_src:
 *           type: string
 *           maxLength: 200
 *         is_active:
 *           type: boolean
 *           default: true
 *         rank:
 *           type: number
 *           minimum: 1
 *         created_by:
 *           type: number
 *         updated_by:
 *           type: number
 */

/**
 * @swagger
 * /api/widgetDetails:
 *   post:
 *     summary: Create a new WidgetDetails Record
 *     tags: [WidgetDetails]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               sub_title:
 *                 type: string
 *               template:
 *                 type: string
 *               button_text:
 *                 type: string
 *               button_src:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               rank:
 *                 type: number
 *               created_by:
 *                 type: number
 *               updated_by:
 *                 type: number
 *               widgetId:
 *                 type: number
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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
 *                   $ref: '#/components/schemas/WidgetDetails'
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
 * /api/widgetDetails/{id}:
 *   put:
 *     summary: Update a WidgetDetails Record
 *     tags: [WidgetDetails]
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
 *         description: ID of the widget details record to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               sub_title:
 *                 type: string
 *               template:
 *                 type: string
 *               button_text:
 *                 type: string
 *               button_src:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               rank:
 *                 type: number
 *               created_by:
 *                 type: number
 *               updated_by:
 *                 type: number
 *               widgetId:
 *                 type: number
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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
 *                   $ref: '#/components/schemas/WidgetDetails'
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
 * /api/widgetDetails/{id}:
 *   delete:
 *     summary: Delete a WidgetDetails Record
 *     tags: [WidgetDetails]
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
 *         description: ID of the widget details record to delete
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
 *                   $ref: '#/components/schemas/WidgetDetails'
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
 * /api/widgetDetails:
 *   get:
 *     summary: Get all WidgetDetails Records
 *     tags: [WidgetDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         description: Number of records per page
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
 *                     $ref: '#/components/schemas/WidgetDetails'
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
 * /api/widgetDetails/{id}:
 *   get:
 *     summary: Get a WidgetDetails Record by ID
 *     tags: [WidgetDetails]
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
 *         description: ID of the widget details record to retrieve
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
 *                   $ref: '#/components/schemas/WidgetDetails'
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
 * /api/widgetDetails/search/{fieldName}/{fieldValue}:
 *   get:
 *     summary: Search WidgetDetails Records by fieldName and fieldValue
 *     tags: [WidgetDetails]
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
 *                     $ref: '#/components/schemas/WidgetDetails'
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
