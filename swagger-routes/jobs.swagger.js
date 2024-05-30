/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
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
 *               title:
 *                 type: string
 *                 description: Job title
 *               category_id:
 *                 type: string
 *                 description: Job category ID
 *               description:
 *                 type: string
 *                 description: Job description
 *               min_experience:
 *                 type: integer
 *                 description: Minimum experience required
 *               job_location:
 *                 type: string
 *                 description: Job location
 *               salary_offered:
 *                 type: number
 *                 format: float
 *                 description: Salary offered for the job
 *               created_by:
 *                 type: number
 *                 description: ID of the creator
 *               updated_by:
 *                 type: number
 *                 description: ID of the updater
 *               registrationId:
 *                 type: number
 *                 description: Registration ID
 *             required:
 *               - title
 *               - category_id
 *               - description
 *               - min_experience
 *               - job_location
 *               - salary_offered
 *               - created_by
 *               - updated_by
 *               - registrationId
 *     responses:
 *       '201':
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Job created successfully
 *               data:
 *                 id: 1
 *                 title: "Software Engineer"
 *                 category_id: "1"
 *                 description: "Develop and maintain software"
 *                 min_experience: 2
 *                 job_location: "Remote"
 *                 salary_offered: 60000.00
 *                 created_by: 1
 *                 updated_by: 1
 *                 registrationId: 123
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
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
 *         description: List of jobs fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Jobs fetched successfully
 *               totalRecords: 100
 *               data:
 *                 - id: 1
 *                   title: "Software Engineer"
 *                   category_id: "1"
 *                   description: "Develop and maintain software"
 *                   min_experience: 2
 *                   job_location: "Remote"
 *                   salary_offered: 60000.00
 *                   created_by: 1
 *                   updated_by: 1
 *                   registrationId: 123
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: No records found
 *       '500':
 *         description: Internal server error
 *
 * /api/jobs/search/{fieldName}/{fieldValue}:
 *   get:
 *     summary: Search jobs by field
 *     tags: [Jobs]
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
 *                   title: "Software Engineer"
 *                   category_id: "1"
 *                   description: "Develop and maintain software"
 *                   min_experience: 2
 *                   job_location: "Remote"
 *                   salary_offered: 60000.00
 *                   created_by: 1
 *                   updated_by: 1
 *                   registrationId: 123
 *       '400':
 *         description: Invalid field name
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: No records found
 *       '500':
 *         description: Internal server error
 *
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job details by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         type: string
 *       - in: path
 *         name: id
 *         description: ID of the job to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Job details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Job details fetched successfully
 *               data:
 *                 id: 1
 *                 title: "Software Engineer"
 *                 category_id: "1"
 *                 description: "Develop and maintain software"
 *                 min_experience: 2
 *                 job_location: "Remote"
 *                 salary_offered: 60000.00
 *                 created_by: 1
 *                 updated_by: 1
 *                 registrationId: 123
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Job not found
 *       '500':
 *         description: Internal server error
 *   put:
 *     summary: Update a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         type: string
 *       - in: path
 *         name: id
 *         description: ID of the job to update
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
 *               title:
 *                 type: string
 *                 description: Job title
 *               category_id:
 *                 type: string
 *                 description: Job category ID
 *               description:
 *                 type: string
 *                 description: Job description
 *               min_experience:
 *                 type: integer
 *                 description: Minimum experience required
 *               job_location:
 *                 type: string
 *                 description: Job location
 *               salary_offered:
 *                 type: number
 *                 format: float
 *                 description: Salary offered for the job
 *               created_by:
 *                 type: number
 *                 description: ID of the creator
 *               updated_by:
 *                 type: number
 *                 description: ID of the updater
 *               registrationId:
 *                 type: number
 *                 description: Registration ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Job updated successfully
 *               data:
 *                 id: 1
 *                 title: "Software Engineer"
 *                 category_id: "1"
 *                 description: "Develop and maintain software"
 *                 min_experience: 2
 *                 job_location: "Remote"
 *                 salary_offered: 60000.00
 *                 created_by: 1
 *                 updated_by: 1
 *                 registrationId: 123
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Job not found
 *       '500':
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token for authentication
 *         required: true
 *         type: string
 *       - in: path
 *         name: id
 *         description: ID of the job to delete
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Job deleted successfully
 *               data:
 *                 id: 1
 *                 title: "Software Engineer"
 *                 category_id: "1"
 *                 description: "Develop and maintain software"
 *                 min_experience: 2
 *                 job_location: "Remote"
 *                 salary_offered: 60000.00
 *                 created_by: 1
 *                 updated_by: 1
 *                 registrationId: 123
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Job not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/jobs/job/{title}:
 *   get:
 *     summary: Get job details by title
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: title
 *         description: Title of the job to search
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Job details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Job details fetched successfully
 *               data:
 *                 - id: 1
 *                   title: "Software Engineer"
 *                   category_id: "1"
 *                   description: "Develop and maintain software"
 *                   min_experience: 2
 *                   job_location: "Remote"
 *                   salary_offered: 60000.00
 *                   created_by: 1
 *                   updated_by: 1
 *                   registrationId: 123
 *                   categories:
 *                     - id: 1
 *                       title: "Engineering"
 *                   registration:
 *                     id: 1
 *                     city: "San Francisco"
 *                     state: "CA"
 *                     whatsapp_number: "1234567890"
 *                     user:
 *                       id: 1
 *                       country_code: "+1"
 *                       mobile_number: "9876543210"
 *               categories:
 *                 - "Engineering"
 *                 - "Management"
 *               locations:
 *                 - "Remote"
 *                 - "New York"
 *               experience:
 *                 - 2
 *                 - 5
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Job not found
 *       '500':
 *         description: Internal server error
 *
 * /api/jobs/listing/{title}:
 *   get:
 *     summary: Get filtered job listings by title
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: title
 *         description: Title of the job to search
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: categories
 *         description: Comma-separated list of categories to filter by
 *         schema:
 *           type: string
 *       - in: query
 *         name: locations
 *         description: Comma-separated list of locations to filter by
 *         schema:
 *           type: string
 *       - in: query
 *         name: experiences
 *         description: Comma-separated list of experiences to filter by
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         description: Field to sort by (salary, createdAt)
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         description: Sort order (ASC, DESC)
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of jobs fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Jobs fetched successfully
 *               totalRecords: 100
 *               data:
 *                 - id: 1
 *                   title: "Software Engineer"
 *                   category_id: "1"
 *                   description: "Develop and maintain software"
 *                   min_experience: 2
 *                   job_location: "Remote"
 *                   salary_offered: 60000.00
 *                   created_by: 1
 *                   updated_by: 1
 *                   registrationId: 123
 *                   categories:
 *                     - id: 1
 *                       title: "Engineering"
 *                   registration:
 *                     id: 1
 *                     city: "San Francisco"
 *                     state: "CA"
 *                     whatsapp_number: "1234567890"
 *                     user:
 *                       id: 1
 *                       country_code: "+1"
 *                       mobile_number: "9876543210"
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: No records found
 *       '500':
 *         description: Internal server error
 */
