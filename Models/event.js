const mongoose = require('mongoose');
//이벤트는 게시판이 아니긴 한데...
const eventSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        category: {
            //하위 카테고리(배열?): survey, recover
            type: String,
            required: true
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
        defence: {
            //도배방지
            type: String,
            required: true
        },
        tags: [
            {
                type: String
            }
        ],
        likes: [
            {
                users: {
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
                    required: true
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

module.exports = mongoose.model('event', eventSchema);