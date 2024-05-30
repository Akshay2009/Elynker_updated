/**
 * @swagger
 * /api/subscription:
 *   post:
 *     summary: Create a new Subscription
 *     tags: [Subscription]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: integer
 *               price:
 *                 type: number
 *                 format: decimal
 *               services:
 *                 type: string
 *               tax:
 *                 type: number
 *                 format: decimal
 *               discount:
 *                 type: number
 *                 format: decimal
 *               created_by:
 *                 type: integer
 *               updated_by:
 *                 type: integer
 *             required:
 *               - name
 *               - description
 *     responses:
 *       '201':
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Subscription created successfully
 *               data: {}
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/subscription/{id}:
 *   put:
 *     summary: Update an existing Subscription
 *     tags: [Subscription]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: ID of the subscription to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: integer
 *               price:
 *                 type: number
 *                 format: decimal
 *               services:
 *                 type: string
 *               tax:
 *                 type: number
 *                 format: decimal
 *               discount:
 *                 type: number
 *                 format: decimal
 *               created_by:
 *                 type: integer
 *               updated_by:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Subscription updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Subscription updated successfully
 *               data: {}
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Subscription not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/subscription/{id}:
 *   delete:
 *     summary: Delete a Subscription by ID
 *     tags: [Subscription]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: ID of the subscription to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Subscription deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Subscription deleted successfully
 *               data: {}
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Subscription not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/subscription:
 *   get:
 *     summary: Get all Subscriptions
 *     tags: [Subscription]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page for pagination
 *         schema:
 *           type: integer
 *       - name: pageSize
 *         in: query
 *         description: Page size for pagination
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Subscriptions fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Subscriptions fetched successfully
 *               totalRecords: 0
 *               data: []
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/subscription/search/{fieldName}/{fieldValue}:
 *   get:
 *     summary: Search Subscriptions by field
 *     tags: [Subscription]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: fieldName
 *         description: Name of the field to search
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: fieldValue
 *         description: Value of the field to search
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Subscriptions fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Subscriptions fetched successfully
 *               data: []
 *       '400':
 *         description: Invalid field name
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: No records found
 *       '500':
 *         description: Internal server error
 */
