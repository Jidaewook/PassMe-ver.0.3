const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users'
    }, 
    age: {
        type: Number
    }, 
    bio: {
        type: String
    }, 
    major: {
        type: String
    }, 
    location: {
        type: [String]
    }, 
    testname: {
        type: [String],
        required: true
    }, 
    preference: {
        type: [String]
    }, 
    task: {
        type: [String],
        required: true
    }, 
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('profile', ProfileSchema);s