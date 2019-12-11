const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local','google', 'facebook', 'naver','kakao'],
        required: true
    }, 
    local: {
        email: {
            type: String,
            lowercase: true
        }, 
        password: {
            type: String
        }, 
        avatar: {
            type: String
        }
    }, 
    google: {
        id: {
            type: String
        }, 
        email: {
            type: String,
            lowercase: true
        }, 
        avatar: {
            type: String
        }
    }, 
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        },
        avatar: {
            type: String
        }
    }, 
    naver: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        },
        avatar: {
            type: String
        }
    }, 
    kakao: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        },
        avatar: {
            type: String
        }
    }
});

userSchema.pre('save', async function(next){
    try{
        console.log('entered');
        if(this.method !== 'local'){
            next();
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        this.local.password = passwordHash;
        console.log('exited');
        next();
    }
    catch(error){
        next(error);
    }
});

module.exports = mongoose.model('users', userSchema);