const urlModel = require('../Models/UrlModel')
const shortid = require('shortid');
const validUrl = require('valid-url')
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



//==========================================================================================

const shortenUrl = async function (req, res) {
    try {
        const baseUrl = 'http://localhost:3000'
        const longUrl = req.body.longUrl

       

        if (!validUrl.isUri(baseUrl)) {
            return res.status(401).send({ status: false, msg: "Invalid baseUrl" })
        }
        const urlCode = shortid.generate()

        if (validUrl.isUri(longUrl.trim())) {
            let url = await urlModel.findOne({ longUrl: longUrl })
            if (url) {
                res.status(200).send({status:true, message: "You have already created shortUrl for the requested URL as given below", data: url.shortUrl })
               
            } else {
                // join the generated short code the the base url
                const shortUrl = baseUrl + '/' + urlCode.toLowerCase()

                // invoking the Url model and saving to the DB
                url =await  urlModel.create({
                    longUrl,
                    shortUrl,
                    urlCode,

                })
                await SET_ASYNC(urlCode.toLowerCase(), longUrl); // save also in caching memory 
                res.status(201).send({ status: true, data: url})
            }
        } else {
            res.status(401).send({ status: false, msg: "Invalid LongUrl" })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


//===================================================================================
const getUrl = async function (req, res) {
    try {
        
      let cachedData = await GET_ASYNC(req.params.urlCode.trim().toLowerCase());
      if (cachedData) {
        console.log("data from cache memory")
        res.status(302).redirect(cachedData);
      } else {
        const url = await urlModel.findOne({ urlCode: req.params.urlCode });
        if (url) {
          res.status(302).redirect(url.longUrl);
        } else {
          // else return a not found 404 status
          return res.status(404).send({ status: false, msg: "No URL Found" });
        }
      }
      // exception handler
    } catch (err) {
      console.error(err);
      res.status(500).send({status:false, msg:err.message});
    }
  };
  



module.exports.getUrl = getUrl;
module.exports.shortenUrl = shortenUrl






