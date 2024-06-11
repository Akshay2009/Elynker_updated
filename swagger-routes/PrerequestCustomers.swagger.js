/**
 * @swagger
 * /api/prerequestCustomers:
 *   post:
 *     summary: Create a new prerequest customer
 *     tags: [PrerequestCustomers]
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
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               mobile_number:
 *                 type: string
 *                 example: "1234567890"
 *               type:
 *                 type: string
 *                 example: "Individual"
 *               created_by:
 *                 type: integer
 *                 example: 1
 *               updated_by:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - name
 *               - email
 *               - mobile_number
 *               - type
 *     responses:
 *       '201':
 *         description: Prerequest customer created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Record created successfully"
 *               data:
 *                 id: 1
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 mobile_number: "1234567890"
 *                 type: "Individual"
 *                 created_by: 1
 *                 updated_by: 1
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: "All fields are Required"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 * 
 *   get:
 *     summary: Get all prerequest customers
 *     tags: [PrerequestCustomers]
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
 *         description: List of prerequest customers
 *         content:
 *           application/json:
 *             example:
 *               message: "Records retrieved successfully"
 *               totalRecords: 1
 *               data:
 *                 - id: 1
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   mobile_number: "1234567890"
 *                   type: "Individual"
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
 * /api/prerequestCustomers/{id}:
 *   get:
 *     summary: Get prerequest customer by ID
 *     tags: [PrerequestCustomers]
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
 *         description: ID of the prerequest customer
 *     responses:
 *       '200':
 *         description: Prerequest customer retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Record retrieved successfully"
 *               data:
 *                 id: 1
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 mobile_number: "1234567890"
 *                 type: "Individual"
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
 *         description: Record not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Record not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 * 
 * /api/prerequestCustomers/search/{fieldName}/{fieldValue}:
 *   get:
 *     summary: Search prerequest customers by field
 *     tags: [PrerequestCustomers]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: fieldName
 *         required: true
 *         schema:
 *           type: string
 *           example: "name"
 *         description: Field name to search by
 *       - in: path
 *         name: fieldValue
 *         required: true
 *         schema:
 *           type: string
 *           example: "John Doe"
 *         description: Field value to search for
 *     responses:
 *       '200':
 *         description: Prerequest customers retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Records retrieved successfully"
 *               data:
 *                 - id: 1
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   mobile_number: "1234567890"
 *                   type: "Individual"
 *                   created_by: 1
 *                   updated_by: 1
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: "Field does not exist"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       '404':
 *         description: Record not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Record not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */
