const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [2000, 'Description can not be more than 2000 characters']
    },
    salary: {
        type: Number,
        required: [true, 'Please add a salary']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    companyName: {
        type: String,
        required: [true, 'Please add a company name']
    },
    companyLogo: {
        type: String,
        default: ''
    },
    jobType: {
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        default: 'Full-time'
    },
    recruiter: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
