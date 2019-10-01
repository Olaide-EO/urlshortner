const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dns = require('dns');
const shortURL = require(__dirname + '/models/shortURL');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://ebenezer:ebenezer@ebenezer-m15jl.mongodb.net/test?retryWrites=true&w=majority');
app.use("/public",express.static(__dirname + "/public"));


app.get("/", function(req,res){
    res.sendFile(__dirname + "/views/index.html");
})

app.get('/new/:urlToShorten(*)', function(req, res, next){
    let { urlToShorten } = req.params;
    res.json({"hello":"heelo"});
     
})



app.post("/api/shorturl/new", (req, res, next)=>{
     originalurl = req.body.url;
    regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(originalurl))
        {
            let hostName = originalurl;

           let REPLACE_REGEX = /^https?:\/\//i;

           let editedHostName = hostName.replace(REPLACE_REGEX, '');
           console.log(editedHostName);

           let short = Math.floor(Math.random()*100000).toString();

           let data = new shortURL(
               {
                   originalURL: originalurl,
                   shortURL: short
               }
           )

           dns.lookup(editedHostName, function(err, address, family ){
            if(err){
                res.json({"Error": "Invalid URL" })}
                else{
                    data.save(err=>{
                        if(err){
                            res.send('Error Saving to Database')
                        }

                    })
                    res.json(data);
                };
       });
     
    }
        else
        {
            res.json( {"Error": "Invalid URL"});
        }

}

);


app.get('/api/shorturl/:urlToSearch', (req, res, next)=>{
    let shortURLToSearch = req.params.urlToSearch;
    shortURL.findOne({shortURL: shortURLToSearch}, (err, data)=>{
        if(err) return res.send('Error reading database');
        let reg = new RegExp("^(http|https)://", "i");
        let checkString = data.originalURL;
        if(reg.test(checkString)){
         res.redirect(301, data.originalURL);
        }
      else{
          res.redirect(301, 'https://'+data.originalURL);
      } 
    })
})



//Listen to see if everything is working
//(ES5) function(){}
app.listen(3000, function(){
console.log('Everything is working');
})