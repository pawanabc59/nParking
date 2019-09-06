var express = require('express')
var router = express.Router()
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const mysql = require("mysql");
const session = require('express-session');
const md5 = require('md5');
const multer = require('multer');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const assert = require('assert');
const csv=require('csvtojson');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const mkdirp = require('mkdirp');
const NodeGeocoder = require('node-geocoder');
const QRCode = require('qrcode');
var MapboxClient = require('mapbox')
//var json2csv = require('json2csv');

 
// QRCode.toFile('C:/wamp/www/EventMania/files/quotation.png', 'Some text', {
//   color: {
//     dark: '#00F',  // Blue dots
//     light: '#0000' // Transparent background
//   }
// }, function (err) {
//   if (err) throw err
//   console.log('done')
// })

const con = require('../configuration/databaseConnection.js');
const database = require("../functions/placeOwnerQuery.js");
const mail = require('../functions/mail.js');
//const pdfObj = require('../functions/pdf.js');


const storage = multer.diskStorage({
	destination : function(req,file,cb){
		console.log("inside storage");
		var placeOwnerEmail = req.session.email;
		const dir = './public/uploads/placeOwner/'+ placeOwnerEmail;
		mkdirp(dir, err => cb(null, dir));//+club+'/'+event
	},
	filename : function(req,file,cb){
		let temp = file.originalname;
		cb(null , temp)
	}
});

var upload = multer({ storage: storage })

var client = new MapboxClient('pk.eyJ1IjoiZHluYW1vMjgxOCIsImEiOiJjanUxZ3prMmMwMWt0NGJwYXZpNDk5NXg4In0.M_GgSOEjSUkEFQI7PhR7Jw')

router.post('/register', function(req, res){
	var firstName = req.body.fname;
	var lastName = req.body.lname;
	var contactNumber = req.body.contactNo;
	var email = req.body.email;
	var password = req.body.password;
	var hash = md5(password);
	var name = firstName+" "+lastName;

	var sql = "CREATE TABLE IF NOT EXISTS `placeOwnerReg` (`fname` varchar(50) NOT NULL, `lname` varchar(50) NOT NULL, `contactNo` varchar(50) NOT NULL, `email` varchar(100) NOT NULL PRIMARY KEY, `password` varchar(100) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;"
	con.query(sql, function(err, result){
		if (err) throw err;
    	// console.log("Table created");
    	database.placeOwnerRegistration(firstName, lastName, contactNumber, email, hash, function(err, result){
    		if (err) {
    			throw err;
    		}
    		mail.sendMail(name, password, email, "Place Owner")
    		res.redirect("/home");
    	});
	});

});

router.get('/addPlace', function(req, res){
	res.render("addPlace.ejs");
});

router.post('/addPlace',upload.array('placeImages',1), function(req,res){
	var email = req.session.email;
	var title = req.body.title;
	var address = req.body.address;
	var slots = req.body.slot;
	var startTime = req.body.arrivalTime;
	var endTime = req.body.closingTime;
	// console.log("Time difference is "+(endTime-startTime));
	console.log(req.files);

	console.log("file 1 originalname "+req.files[0].originalname);

	var temp = req.files[0].destination.split('.');
	var path = temp[1]+'.'+temp[2];
	console.log("path 1 "+path);

	var path1 = path.split('/');
	var path2 = path1[2]+'/'+path1[3]+'/'+path1[4];

	var image = '/'+path2+"/"+req.files[0].originalname;
	console.log("image "+image);


	// var temp1 = req.files[1].destination.split('.')
	// var path2 = temp1[1]+'.'+temp1[2];
	// console.log("path 2 "+path2);

	var sql = "create table if not exists addPlace (id int(100) not null AUTO_INCREMENT, email varchar(100) not null, title varchar(200) not null, address varchar(100) not null, slot int(100) not null, image varchar(200) not null, startTime varchar(50) not null, endTime varchar(50) not null, slotsLeft int(100) not null, PRIMARY KEY (id))";
	con.query(sql, function(err, result){
		if (err) {throw err;}

		database.addPlace(email, title, address, slots, image, startTime, endTime, slots, function(err, result){
			if (err) {throw err;}
			mail.placeAddedMail(email, title, address, slots, startTime, endTime);
			res.redirect("/home");
		});

	});

	// res.redirect("/home");
	
});

// router.post('/event_register',upload.array('Quotation'),(req,res)=>{
// 	if (req.session.email) {
	
// 	console.log(req.files);
// 	var eventName = req.body.eventName;
// 	var organiserEmail = req.body.organiserEmail;
// 	var venue = req.body.venue;
// 	var startDate = req.body.start_date;
// 	var endDate = req.body.end_date;
// 	var startTime = req.body.start_time;
// 	var endTime = req.body.end_time;
// 	var noOfVolunteers = req.body.noOfVolunteer;
// 	var description = req.body.description;
// 	var contactDetails = req.body.contactNumber;

// 	console.log(req.files[0].originalname);

// 	var temp = req.files[0].destination.split('.')
// 	var path = temp[1]+'.'+temp[2];
// 	console.log(path);


// 	var temp1 = req.files[1].destination.split('.')
// 	var path2 = temp1[1]+'.'+temp1[2];
// 	console.log(path2);
// 	var quotation = "192.168.43.19/EventMania"+path+"/"+req.files[0].originalname;
// 	var image = "192.168.43.19/EventMania"+path2+"/"+req.files[1].originalname;
// 	console.log(quotation);
// 	console.log(image);

// 	client.geocodeForward(venue, function (err, data, res1) {
// 	  console.log(data['features'][0]['geometry']['coordinates'])
// 	  var temp = data['features'][0]['geometry']['coordinates'];
// 	  var latitude = temp[1]
// 	  var longitude = temp[0]
// 	  console.log(latitude);

// 	database.eventRegistration(eventName,organiserEmail,venue,startDate,endDate,startTime,endTime,noOfVolunteers,quotation,description,latitude,longitude,contactDetails,image,function(err,result){
// 		if (err){ 
// 		throw err;
// 	    res.sendStatus(400);
// 	    }
// 	    console.log("1 record inserted");
// 	    res.redirect("/home");
// 	});


// 	});
// 	}
// 	else{
// 		res.redirect("/login")
// 	}
// });


//Organiser Registration
// router.post('/register',(req,res)=>{

// 	var firstName = req.body.fname;
// 	var lastName = req.body.lname;
// 	var email = req.body.email;
// 	var password = req.body.password;
// 	var contactNumber = req.body.contactNo;
// 	var city = req.body.city;
// 	var instituteName = req.body.instituteName;
// 	var hash = md5(password);
// 	console.log(password);
// 	console.log(hash);


// 	database.organiserRegistration(firstName,lastName,hash,contactNumber,city,email,instituteName,function(err,result){
// 		if (err){ 
// 		throw err;
// 	    res.sendStatus(400);
// 	    }
// 	    console.log("1 record inserted");
// 	    mail.sendMail(firstName,password,email,"Organiser");
// 	    res.redirect("/home");
// 	});
// });


module.exports = router;