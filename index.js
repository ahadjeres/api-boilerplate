const express = require("express");
const morgan = require("morgan");
const logger = require("winston");
const request = require("axios");
const cors = require("cors");
const helmet  = require("helmet");


//loading express
const app = express();

const parserOpts = {
  limit: "1mb"
};

//express config
app.disable("etag");
app.enable("trust proxy");
app.enable("case sensitive routing");
app.enable("strict routing");

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json(parserOpts));
app.use(
  express.urlencoded({
    ...parserOpts,
    parameterLimit: 10000,
    extended: true
  })
);

app.use(morgan("dev"));

app.get("/coins", async function(req, res){
  try{
    let raw  = await request.get("https://api.coinmarketcap.com/v2/listings");

    let array = []

      // logger.info(JSON.stringify(raw.data.data, 0, 4));
    for(let i in raw.data.data){
      let obj = raw.data.data[i];
      logger.info(JSON.stringify(obj, 0, 4));
      obj.name = `${obj.name} 💸`;
      array.push(obj);

      if(i == 5){
        return res.json({
          "data":array
        });
      }
    }
  }catch(e){
    logger.error(e);
    return res.json({
      "error":e.Error
    });
  }
   return res.json({
     "data":"hello word"
   });
});
app.listen(8080, function ()  {
  logger.info(`listening on port 8080`);
});
