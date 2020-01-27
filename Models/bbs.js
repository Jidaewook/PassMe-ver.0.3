
const mongoose = require('mongoose');

// bbs schema
const bbsScheama = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        category: {
            type: String,
            required: true,


        },
        title: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        bbsimg: {
            type: String
        },
        url: {
            type: String
        },
        tags: [
            {
                type: String
            }
        ],
        like: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users'
                }
            }
        ], 
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users'
                },
                desc: {
                    type: String,
                    require: true
                },
                like: [
                    {
                        user: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'users'
                        }
                    }
                ],
                date: {
                    type: Date,
                    default: Date.now()
                }
            }
        ]

    },
    {timestamps: true}
)



module.exports = mongoose.model('bbs', bbsScheama);