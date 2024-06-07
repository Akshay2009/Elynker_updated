const db = require('../models');
const JobApplication = db.jobApplication;
const Jobs = db.jobs;
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const JOB_APPLICATION_PATH = path.join(process.env.JOB_APPLICATION_PATH);
const serviceResponse = require('../config/serviceResponse');
const logErrorToFile = require('../logger');
const { error } = require('console');
const { log } = require('sharp/lib/libvips');



module.exports.save = async function(req,res){
    try {
        const { name, phone_number, email, created_by, updated_by,jobId } = req.body;
        let resume;
        let cover_letter;
        if(req.files['resume']){
            resume = req.files['resume'][0].filename;
        }
        if(req.files['cover_letter']){
            cover_letter = req.files['cover_letter'][0].filename;
        }

        const jobRecord = await Jobs.findByPk(jobId);
        if(!jobRecord){
            if(resume){
                fs.unlinkSync(path.join(__dirname,'../..',JOB_APPLICATION_PATH,'/',resume));
            }
            if(cover_letter){
                fs.unlinkSync(path.join(__dirname,'../..',JOB_APPLICATION_PATH,'/',cover_letter));
            }
            return res.status(serviceResponse.notFound).json({ error: 'No Job Found with provided jobId' });
        }
        if(!name || !phone_number){
            if(resume){
                fs.unlinkSync(path.join(__dirname,'../..',JOB_APPLICATION_PATH,'/',resume));
            }
            if(cover_letter){
                fs.unlinkSync(path.join(__dirname,'../..',JOB_APPLICATION_PATH,'/',cover_letter));
            }
            return res.status(serviceResponse.badRequest).json({ error: 'Phone Number or Name not provided' });
        }

        // Save to database
        const jobApplication = await JobApplication.create({
            name,
            phone_number,
            email,
            resume: resume,
            cover_letter: cover_letter,
            created_by,
            updated_by,
            jobId,
        });
        if(jobApplication){
            return res.status(serviceResponse.saveSuccess).json({ message:serviceResponse.getMessage, data: jobApplication });
        }else{
            return res.status(serviceResponse.badRequest).json({ error: serviceResponse.errorCreatingRecord });
        }
    } catch(err){
        logErrorToFile.logErrorToFile(err, 'jobApplication.controller', 'save');
        if (err instanceof Sequelize.Error) {
            return res.status(serviceResponse.badRequest).json({ error: err.message });
        }
        return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
    }
}

module.exports.search = async function (req, res) {
    try {
        const { fieldName, fieldValue } = req.params;
        if (!JobApplication.rawAttributes[fieldName]) {
            return res
                .status(serviceResponse.badRequest)
                .json({ error: serviceResponse.fieldNotExistMessage });
        }
        const records = await JobApplication.findAll({
            where: {
                [fieldName]: fieldValue,
            },
        });
        if (records.length > 0) {
            return res.status(serviceResponse.ok).json({ message: serviceResponse.getMessage, data: records });
        } else {
            return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
        }
    } catch (err) {
        logErrorToFile.logErrorToFile(err, "jobApplication.controller", "search");
        if (err instanceof Sequelize.Error) {
            return res
                .status(serviceResponse.badRequest)
                .json({ error: err.message });
        }
        return res
            .status(serviceResponse.internalServerError)
            .json({ error: serviceResponse.internalServerErrorMessage });
    }
};