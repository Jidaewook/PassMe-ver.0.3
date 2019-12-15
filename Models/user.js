// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//         name: {
//             type: String, 
//             trim: true,
//             required: true,
//             max: 32
//         }, 
//         email: {
//             type: String,
//             trim: true,
//             required: true,
//             unique: true,
//             lowercase: true
//         },
//         hashed_password: {
//             type: String,
//             required: true
//         },
//         salt: String,
//         role: {
//             type: String,
//             default: 'subscriber'
//         },
//         resetPasswordLink: {
//             data: String,
//             default: ''
//         }},
//     {timestamps: true}
// );

// //bcrypto랑 crypto가 설치되어 있으면, 이 구문을 통해 패스워드 암호화 작업이 진행된다.
// // userSchema.pre('save', async function(next){
// //     try{
        
// //         const salt = await bcrypt.genSalt(this.makeSalt());
// //         const passwordHash = await bcrypt.hash(this.hashed_password, salt);
// //         this.hashed_password = passwordHash;
        
// //         next();
// //     }
// //     catch(error){
// //         next(error);
// //     }
// // });

// userSchema
//         .virtual('password')
//         .set(function(password){
//             this._password = password;
//             this.salt = this.makeSalt();
//             this.hashed_password = this.encryptPassword(password);
//         })
//         .get(function(){
//             return this._password;
//         });

// userSchema.methods = {
//     authenticate: function(plainText){
//         return this.encryptPassword(plainText) === this.hashed_password;

//     },
//     encryptPassword: function(password){
//         if(!password) return '';
//         try{
//             return crypto
//                 .createHmac('sha1', this.salt)
//                 .update(password)
//                 .digest('hex');
//         } catch(err){
//             return '';
//         }
//     },
//     makeSalt: function(){
//         return Math.round(new Date().valueOf() * Math.random()) + '';
//     }
// }


// module.exports = mongoose.model('users', userSchema);

const mongoose = require('mongoose');
const crypto = require('crypto');

// user schema
const userScheama = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        salt: String,
        role: {
            type: String,
            default: 'subscriber'
        },
        resetPasswordLink: {
            data: String,
            default: ''
        }
    },
    { timestamps: true }
);

// virtual
userScheama
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });



// methods
userScheama.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password; // true false
    },

    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};

module.exports = mongoose.model('User', userScheama);