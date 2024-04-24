/**
 * @swagger
 * tags:
 *   name: Miscellaneous
 *   description: API endpoints for managing vendor records
 * definitions:
 *   Vendor:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       image_path:
 *         type: string
 *       isActive:
 *         type: boolean
 *       ip_address:
 *         type: string
 *       registration_type:
 *         type: integer
 *       dob:
 *         type: string
 *         format: date
 *       latitude:
 *         type: string
 *       longitude:
 *         type: string
 *       steps_completed:
 *         type: boolean
 *       active_steps:
 *         type: integer
 *       city:
 *         type: string
 *       address1:
 *         type: string
 *       address2:
 *         type: string
 *       state:
 *         type: string
 *       country:
 *         type: string
 *       company_name:
 *         type: string
 *       business_type:
 *         type: integer
 *       business_description:
 *         type: string
 *       education:
 *         type: string
 *       available_hrs_per_week:
 *         type: integer
 *       hourly_rate:
 *         type: number
 *       service_fee:
 *         type: number
 *       currency_id:
 *         type: integer
 *       cover_image:
 *         type: string
 *       category_ids:
 *         type: string
 *       freelancer_role:
 *         type: string
 *       freelancer_bio:
 *         type: string
 *       language:
 *         type: string
 *       about_company:
 *         type: string
 *       whatsapp_number:
 *         type: string
 *     required:
 *       - name
 *       - registration_type
 *       - city
 * /api/vendors/{type}:
 *   get:
 *     summary: Get vendors by type and location and categoryId
 *     tags: [Miscellaneous]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         description: Vendor registration type
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         description: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         description: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: rating
 *         description: rating
 *         schema:
 *           type: float
 *     responses:
 *       '200':
 *         description: Vendors fetched successfully
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
 *                     $ref: '#/definitions/Vendor'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: No vendors found
 *       '500':
 *         description: Internal server error
 * /api/admin/vendors/{type}:
 *   get:
 *     summary: Get registration records by type (0-for both b2b and freelancer, 2-b2b, 3-freelancer)
 *     tags: [Miscellaneous]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         description: Registration type
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         description: Page number
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         description: Number of records per page
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Registration records fetched successfully
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
 *                     $ref: '#/definitions/Vendor'
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Internal server error
 * /api/admin/vendorDetails/{reg_id}:
 *   get:
 *     summary: Get vendor profile details by registration ID
 *     tags: [Miscellaneous]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reg_id
 *         description: Registration ID of the vendor
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Vendor profile details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Vendor' # Assuming Vendor definition is reused here
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Vendor with the provided registration ID not found
 *       '500':
 *         description: Internal server error
 * 
 * /api/vendorDetails/{reg_id}:
 *   get:
 *     summary: Get Freelancer vendor profile details by registration ID
 *     tags: [Miscellaneous]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reg_id
 *         description: Registration ID of the vendor
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Vendor profile details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Vendor' # Assuming Vendor definition is reused here
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Vendor with the provided registration ID not found
 *       '500':
 *         description: Internal server error
 * /api/vendorDetails/freelancer/{reg_id}:
 *   get:
 *     summary: Get vendor profile details by registration ID
 *     tags: [Miscellaneous]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reg_id
 *         description: Registration ID of the vendor
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Vendor profile details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Vendor' # Assuming Vendor definition is reused here
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Vendor with the provided registration ID not found
 *       '500':
 *         description: Internal server error
 */
