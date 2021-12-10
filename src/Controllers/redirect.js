const urlModel = require('../Models/UrlModel')


const getUrl = async function (req, res) {
    try {
        if (req.params.urlCode == 0) {
            return res.status(400).send({ status: false, msg: "provide body" })
        }
        const url = await urlModel.findOne({ urlCode: req.params.urlCode })
        if (url) {
            // when valid we perform a redirect
            return res.status(302).redirect(url.longUrl)
        } else {
            // else return a not found 404 status
            return res.status(404).send('No URL Found')
        }

    }
    // exception handler
    catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
}
module.exports.getUrl = getUrl