const mongoose = require('mongoose');

const studyBbsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        category: {
            //하위 카테고리(배열?): PSAT, NCS, 상식, 인적성검사, 한국사, 기타
            type: String,
            required: true
        }, 
        headtag: {
            //말머리, 배열: [모집, 1기, 2기, 3기 ...]
                type: String
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

module.exports = mongoose.model('studyBbs', studyBbsSchema);