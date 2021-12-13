const urlModel = require('../Models/UrlModel')
const redis = require("redis");
const { promisify } = require("util");
//Connect to redis
const redisClient = redis.createClient(
    16347,
    "redis-16347.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("4MmS5UQBW9h2KrDmIkpv36GuwotGtv1h", function (err) {
    if (err) throw err;
});
redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const getUrl = async function (req, res) {
    try {
        if (!req.params.urlCode) {
            return res.status(400).send({ status: false, msg: "provide body" })
        }
        let cachedData = await GET_ASYNC(`${req.params.urlCode}`)
        if (cachedData) {
            cachedData = JSON.parse(cachedData)
            res.redirect(cachedData.longUrl)
        } else {
            const url = await urlModel.findOne({ urlCode: req.params.urlCode })
            if (url) {
                await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(url))
                console.log(url)
                res.redirect(url.longUrl);
            }
            else {
                // else return a not found 404 status
                return res.status(404).send('No URL Found')
            }
        }
        // exception handler
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
}
module.exports.getUrl = getUrl