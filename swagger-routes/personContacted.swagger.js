/**
 * @swagger
 * /api/personcontacted:
 *   post:
 *     summary: Create a new PersonContacted record
 *     tags: [PersonContacted]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               person_contact:
 *                 type: string
 *                 description: Person's contact number
 *                 example: "1234567890"
 *               registrationId:
 *                 type: integer
 *                 description: ID of the registration
 *                 example: 1
 *               created_by:
 *                 type: integer
 *                 description: ID of the creator
 *                 example: 1
 *               updated_by:
 *                 type: integer
 *                 description: ID of the updater
 *                 example: 1
 *             required:
 *               - person_contact
 *               - registrationId
 *               - created_by
 *               - updated_by
 *     responses:
 *       '201':
 *         description: PersonContacted record created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: PersonContacted record created successfully
 *               data:
 *                 id: 1
 *                 person_contact: "1234567890"
 *                 registrationId: 1
 *                 created_by: 1
 *                 updated_by: 1
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Registration not found
 *       '500':
 *         description: Internal server error
 * 
 *   get:
 *     summary: Get all PersonContacted records
 *     tags: [PersonContacted]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *       - name: pageSize
 *         in: query
 *         description: Number of records per page
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of PersonContacted records fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: PersonContacted records fetched successfully
 *               totalRecords: 100
 *               data:
 *                 - id: 1
 *                   person_contact: "1234567890"
 *                   registrationId: 1
 *                   created_by: 1
 *                   updated_by: 1
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: No records found
 *       '500':
 *         description: Internal server error
 * 
 * /api/personcontacted/search/{fieldName}/{fieldValue}:
 *   get:
 *     summary: Search PersonContacted records by field
 *     tags: [PersonContacted]
 *     parameters:
 *       - in: path
 *         name: fieldName
 *         description: Name of the field to search by
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: fieldValue
 *         description: Value of the field to search by
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Records found successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Records found successfully
 *               data:
 *                 - id: 1
 *                   person_contact: "1234567890"
 *                   registrationId: 1
 *                   created_by: 1
 *                   updated_by: 1
 *       '400':
 *         description: Invalid field name
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: No records found
 *       '500':
 *         description: Internal server error
 */
