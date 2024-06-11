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
 *                 description: Name of the subscription
 *                 example: "Basic Plan"
 *               description:
 *                 type: string
 *                 description: Description of the subscription
 *                 example: "This is a basic subscription plan."
 *               duration:
 *                 type: integer
 *                 description: Duration of the subscription in months
 *                 example: 12
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the subscription
 *                 example: 99.99
 *               services:
 *                 type: string
 *                 description: Comma-separated list of services
 *                 example: "Service1,Service2,Service3"
 *               tax:
 *                 type: number
 *                 format: float
 *                 description: Tax on the subscription
 *                 example: 9.99
 *               discount:
 *                 type: number
 *                 format: float
 *                 description: Discount on the subscription
 *                 example: 5.00
 *               is_active:
 *                 type: boolean
 *                 description: Whether the subscription is active
 *                 example: true
 *               created_by:
 *                 type: integer
 *                 description: ID of the creator
 *                 example: 1
 *               updated_by:
 *                 type: integer
 *                 description: ID of the updater
 *                 example: 1
 *             required:
 *               - name
 *               - duration
 *               - price
 *               - services
 *               - created_by
 *               - updated_by
 *     responses:
 *       '201':
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Subscription created successfully
 *               data:
 *                 id: 1
 *                 name: "Basic Plan"
 *                 description: "This is a basic subscription plan."
 *                 duration: 12
 *                 price: 99.99
 *                 services: "Service1,Service2,Service3"
 *                 tax: 9.99
 *                 discount: 5.00
 *                 is_active: true
 *                 created_by: 1
 *                 updated_by: 1
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: "All fields are Required"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 *
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of records per page
 *     responses:
 *       '200':
 *         description: List of subscriptions fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Subscriptions fetched successfully
 *               totalRecords: 100
 *               data:
 *                 - id: 1
 *                   name: "Basic Plan"
 *                   description: "This is a basic subscription plan."
 *                   duration: 12
 *                   price: 99.99
 *                   services: "Service1,Service2,Service3"
 *                   tax: 9.99
 *                   discount: 5.00
 *                   is_active: true
 *                   created_by: 1
 *                   updated_by: 1
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       '404':
 *         description: No records found
 *         content:
 *           application/json:
 *             example:
 *               error: "No records found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 *
 * /api/subscription/{id}:
 *   get:
 *     summary: Get Subscription by ID
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
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the subscription to retrieve
 *     responses:
 *       '200':
 *         description: Subscription retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Subscription retrieved successfully
 *               data:
 *                 id: 1
 *                 name: "Basic Plan"
 *                 description: "This is a basic subscription plan."
 *                 duration: 12
 *                 price: 99.99
 *                 services: "Service1,Service2,Service3"
 *                 tax: 9.99
 *                 discount: 5.00
 *                 is_active: true
 *                 created_by: 1
 *                 updated_by: 1
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: "Record not found"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       '404':
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Subscription not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 *
 *   put:
 *     summary: Update Subscription by ID
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the subscription to update
 *         required: true
 *         schema:
 *           type: integer
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
 *                 description: Name of the subscription
 *                 example: "Premium Plan"
 *               description:
 *                 type: string
 *                 description: Description of the subscription
 *                 example: "This is a premium subscription plan."
 *               duration:
 *                 type: integer
 *                 description: Duration of the subscription in months
 *                 example: 24
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the subscription
 *                 example: 199.99
 *               services:
 *                 type: string
 *                 description: Comma-separated list of services
 *                 example: "Service1,Service2,Service3,Service4"
 *               tax:
 *                 type: number
 *                 format: float
 *                 description: Tax on the subscription
 *                 example: 19.99
 *               discount:
 *                 type: number
 *                 format: float
 *                 description: Discount on the subscription
 *                 example: 10.00
 *               is_active:
 *                 type: boolean
 *                 description: Whether the subscription is active
 *                 example: true
 *               created_by:
 *                 type: integer
 *                 description: ID of the creator
 *                 example: 1
 *               updated_by:
 *                 type: integer
 *                 description: ID of the updater
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Subscription updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Subscription updated successfully
 *               data:
 *                 id: 1
 *                 name: "Premium Plan"
 *                 description: "This is a premium subscription plan."
 *                 duration: 24
 *                 price: 199.99
 *                 services: "Service1,Service2,Service3,Service4"
 *                 tax: 19.99
 *                 discount: 10.00
 *                 is_active: true
 *                 created_by: 1
 *                 updated_by: 1
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid data"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       '404':
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Subscription not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 *
 *   delete:
 *     summary: Delete Subscription by ID
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
 *           example: 1
 *     responses:
 *       '200':
 *         description: Subscription deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Subscription deleted successfully
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: "Record not found"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       '404':
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Subscription not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */
