/**
 * @swagger
 * /api/webcomponents:
 *   post:
 *     summary: Create a new WebComponent record
 *     tags: [WebComponents]
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
 *               page_name:
 *                 type: string
 *                 description: Name of the web page
 *                 example: "Home Page"
 *               page_link:
 *                 type: string
 *                 description: URL of the web page
 *                 example: "http://example.com/home"
 *               created_by:
 *                 type: integer
 *                 description: ID of the creator
 *                 example: 1
 *               updated_by:
 *                 type: integer
 *                 description: ID of the updater
 *                 example: 1
 *             required:
 *               - page_name
 *               - created_by
 *               - updated_by
 *     responses:
 *       '201':
 *         description: WebComponent record created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: WebComponent record created successfully
 *               data:
 *                 id: 1
 *                 page_name: "Home Page"
 *                 page_link: "http://example.com/home"
 *                 created_by: 1
 *                 updated_by: 1
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 * 
 *   get:
 *     summary: Get all WebComponent records
 *     tags: [WebComponents]
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
 *         description: List of WebComponent records fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: WebComponent records fetched successfully
 *               totalRecords: 100
 *               data:
 *                 - id: 1
 *                   page_name: "Home Page"
 *                   page_link: "http://example.com/home"
 *                   created_by: 1
 *                   updated_by: 1
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: No records found
 *       '500':
 *         description: Internal server error
 * 
 * /api/webcomponents/search/{fieldName}/{fieldValue}:
 *   get:
 *     summary: Search WebComponent records by field
 *     tags: [WebComponents]
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
 *                   page_name: "Home Page"
 *                   page_link: "http://example.com/home"
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
 * 
 * /api/webcomponents/{id}:
 *   put:
 *     summary: Update a WebComponent record
 *     tags: [WebComponents]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         type: string
 *       - in: path
 *         name: id
 *         description: ID of the WebComponent to update
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
 *               page_name:
 *                 type: string
 *                 description: Name of the web page
 *                 example: "Home Page"
 *               page_link:
 *                 type: string
 *                 description: URL of the web page
 *                 example: "http://example.com/home"
 *               created_by:
 *                 type: integer
 *                 description: ID of the creator
 *                 example: 1
 *               updated_by:
 *                 type: integer
 *                 description: ID of the updater
 *                 example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: WebComponent record updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: WebComponent record updated successfully
 *               data:
 *                 id: 1
 *                 page_name: "Home Page"
 *                 page_link: "http://example.com/home"
 *                 created_by: 1
 *                 updated_by: 1
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: WebComponent not found
 *       '500':
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete a WebComponent record
 *     tags: [WebComponents]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         type: string
 *       - in: path
 *         name: id
 *         description: ID of the WebComponent to delete
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: WebComponent record deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: WebComponent record deleted successfully
 *               data:
 *                 id: 1
 *                 page_name: "Home Page"
 *                 page_link: "http://example.com/home"
 *                 created_by: 1
 *                 updated_by: 1
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: WebComponent not found
 *       '500':
 *         description: Internal server error
 */
