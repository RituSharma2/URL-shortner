const urlModel = require('../Models/UrlModel')
const shortid = require('shortid');
const validUrl = require('valid-url')


const shortenUrl = async function (req, res) {
    try {
        const baseUrl = 'http://localhost:3000'
        const longUrl = req.body.longUrl

        if (req.body && Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "provide body " })
        }

        if (!validUrl.isUri(baseUrl)) {
            return res.status(401).send({ status: false, msg: "Invalid baseUrl" })
        }
        const urlCode = shortid.generate()

        if (validUrl.isUri(longUrl.trim())) {
            let url = await urlModel.findOne({ longUrl: longUrl })
            if (url) {
                res.status(200).send({status:true, message: "You have already created shortUrl for the requested URL as given below", data: url.shortUrl })
                //res.status(200).send({ status: true, data: url.shortUrl })
            } else {
                // join the generated short code the the base url
                const shortUrl = baseUrl + '/' + urlCode.toLowerCase()

                // invoking the Url model and saving to the DB
                url = urlModel({
                    longUrl,
                    shortUrl,
                    urlCode,

                })
                await urlModel.create(url)
                res.status(201).send({ status: true, data: url })
            }
        } else {
            res.status(401).send({ status: false, msg: "Invalid LongUrl" })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
module.exports.shortenUrl = shortenUrl






