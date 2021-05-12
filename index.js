const express 		= require('express');
const app   = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
var moment = require('moment');

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
  var id = '312', age=45; //date=moment(date).format('DD-MM-YY');
  if(req.query.id)
    id = req.query.id;
 // if(req.query.date)
   // date=req.query.date;
  if(req.query.age)
    age=req.query.age;
var completed_requests = 0;
var results=[];
//for(id = 0; id<=737;++id){
for(var k=0;k<28;k=k+7){
  var date=moment().add(k,'days').format('DD-MM-YYYY')
  console.log(date);
  await https.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id='+id+'&date='+date, (resp) => {
    var data=' ',f;

  // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });
  
  completed_requests = completed_requests + 1;
  //console.log(completed_requests);
  // The whole response has been received. Print out the result.
 resp.on('end', () => {
    f = data;
    f= JSON.parse(f);
    for(var i of f.centers)
    {
    	//console.log(i);
    	for(var j of i.sessions)
    	{
    		let obj={};
    		if(j.min_age_limit==age && j.available_capacity>0)
    		{
    			obj={
            DISTRICT: i.district_name,
            STATE: i.state_name,
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
    		results.push(obj)
    	}
    }
     if (completed_requests==4){
  	   console.log(results);
       res.render("home",{results:results});
     }
     
  });
})//.on("error", (err) => {
  //console.log("Error: " + err.message);
//})
}
})
app.listen(process.env.PORT || 3000, ()=>{
	console.log("Server up on Port 3000")
})
