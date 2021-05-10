const express 		= require('express');
const app   = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

app.use(cors());

app.set("view engine", "ejs");

app.use(express.static(__dirname+"/views"));
//app.use(function (req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//  next();
//});
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});
app.options("*", cors());

const https = require('https');


app.get("/",async function(req,res){
	//const appointments = await axios.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=312&date=07-05-2021');
	//console.log(appointments);
  var id = '312', date='09-05-2021', age=45;
  if(req.query.id)
    id = req.query.id;
  if(req.query.date)
    date=req.query.date;
  if(req.query.age)
    age=req.query.age;
https.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id='+id+'&date='+date, (resp) => {
 let data=' ',f,results=[];

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    f = data;
    //for(var i of f.centers)
    //{
    //	//console.log(i);
    //	for(var j of i.sessions)
    //	{
    //		let obj={};
    //		if(j.min_age_limit==age && j.available_capacity>0)
    //		{
    //			obj={
    //				NAME: i.name,
    //				ADDRESS: i.address,
    //				BLOCK: i.block_name,
    //				DATE: j.date,
    //				AVAILABLE: j.available_capacity,
    //				VACCINE: j.vaccine,
    //				SLOTS: j.slots
    //			}
    //		}
    //		else continue;
    //		results.push(obj)
    //	}
    //}
  	res.render("home",{results:results});
  });
  

}).on("error", (err) => {
  console.log("Error: " + err.message);
})
});

app.listen(process.env.PORT || 3000, ()=>{
	console.log("Server up on Port 3000")
});
