const express 		= require('express');
const app   = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

app.use(cors());
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
https.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id='+req.query.id+'&date='+req.query.date, (resp) => {
 let data=' ',f,result=[];

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    f = JSON.parse(data);
    for(var i of f.centers)
    {
    	//console.log(i);
    	for(var j of i.sessions)
    	{
    		let obj={};
    		if(j.min_age_limit==req.query.age && j.available_capacity>0)
    		{
    			obj={
    				NAME: i.name,
    				ADDRESS: i.address,
    				BLOCK: i.block_name,
    				DATE: j.date,
    				AVAILABLE: j.available_capacity,
    				VACCINE: j.vaccine,
    				SLOTS: j.slots
    			}
    		}
    		else continue;
    		result.push(obj)
    	}
    }
  	return res.json(result);
  });
  

}).on("error", (err) => {
  console.log("Error: " + err.message);
})
});

app.listen(process.env.PORT || 3000, ()=>{
	console.log("Server up on Port 3000")
});
