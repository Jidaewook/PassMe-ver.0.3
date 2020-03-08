const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        category: {
            //하위 카테고리(배열?): PSAT, NCS, 상식, 한국사, 인적성검사, 자기소개서, 면접, 기타
            type: String,
            required: true
        }, 
        headtag: {
            //말머리, 배열: [기초접근법, 심화훈련, 해설강의, V솔루션로그(문제풀이촬영), ]
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

module.exports = mongoose.model('lecture', lectureSchema);