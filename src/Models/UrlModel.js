const mongoose = require('mongoose')


const urlSchema = new mongoose.Schema
    ({

        urlCode: {
            type: String,
            required: "urlCode requried",
            unique: true,
            lowercase: true,
            trim: true
        },
        longUrl: {
            type: String,
            trim:true,
            required: "long url required"
        },
        shortUrl: {
            type: String,
            requried: "short url requried",
            unique: true
        }

    }, { timestamps: true })

module.exports = mongoose.model('Url', urlSchema)