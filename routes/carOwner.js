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

const con = require('../configuration/databaseConnection.js');
const database = require("../functions/carOwnerQuery.js");
const mail = require('../functions/mail.js');
// const pdfObj = require('../functions/pdf.js');


// const storage = multer.diskStorage({
// 	destination : function(req,file,cb){
// 		console.log("inside storage");
// 		var email = req.body.email;
// 		const dir = './uploads/volunteer/'+email;
// 		mkdirp(dir, err => cb(null, dir));
// 	},
// 	filename : function(req,file,cb){
// 		let temp = file.originalname;
// 		cb(null , temp)
// 	}
// });

// var upload = multer({ storage: storage })

//Volunteer Registration
// router.post('/register',upload.single('resume'),(req,res)=>{

// 	console.log(req.file);
// 	var firstName = req.body.fname;
// 	var lastName = req.body.lname;
// 	var email = req.body.email;
// 	var password = req.body.password;
// 	var contactNumber = req.body.contactNo;
// 	var city = req.body.city;
// 	var qualification = req.body.qualification;
// 	var field_of_interest = req.body.field_of_interest;
// 	var hash = md5(password);
// 	console.log(password);
// 	console.log(hash);
// 	var temp = req.file.destination.split('.')
// 	var path = temp[1]+'.'+temp[2];
// 	var resume_path = "192.168.43.19/EventMania"+path+"/"+req.file.originalname;
// 	console.log(resume_path);

// 	database.volunteerRegistration(firstName,lastName,hash,contactNumber,city,email,qualification,field_of_interest,resume_path,function(err,result){
// 		if (err){ 
// 		throw err;
// 	    res.sendStatus(400);
// 	    }
// 	    console.log("1 record inserted");
// 	    mail.sendMail(firstName,password,email,"Volunteer");
// 	    res.redirect("/home");
// 	});
// });

router.post('/register', function(req, res){
	var firstName = req.body.fname;
	var lastName = req.body.lname;
	var contactNumber = req.body.contactNo;
	var email = req.body.email;
	var password = req.body.password;
	var hash = md5(password);
	var name = firstName+" "+lastName;

	var sql = "CREATE TABLE IF NOT EXISTS `carOwnerReg` (`fname` varchar(50) NOT NULL, `lname` varchar(50) NOT NULL, `contactNo` varchar(50) NOT NULL, `email` varchar(100) NOT NULL PRIMARY KEY, `password` varchar(100) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;"
	con.query(sql, function(err, result){
		if (err) throw err;
    	// console.log("Table created");
    	database.carOwnerRegistration(firstName, lastName, contactNumber, email, hash, function(err, result){
    		if (err) throw err;
    		mail.sendMail(name, password, email, "Car Owner");
    		res.redirect("/home");
    	});
	});

});

// router.get('/bookPlace', function(req, res){
// 	res.render("bookPlace");
// });

router.post('/bookPlace', function(req, res){
	var userEmail = req.session.email;
	var title = req.body.titleOfPlace;
	var place = req.body.slotsInPlace;
	var arrivalTime = req.body.arrivalTime;
	var departureTime = req.body.departureTime;

	var sql = "create table if not exists `bookedPlace` (`id` int(100) not null AUTO_INCREMENT, `userEmail` varchar(100) not null, `title` varchar(200) not null, `place` varchar(200) not null, `arrivalTime` DATETIME not null, `departureTime` DATETIME not null, `dateOfBooking` DATETIME not null, `exitSlot` int(50) not null, PRIMARY KEY(id))";
	con.query(sql, function(err, result){
		if (err) throw err; 
		database.bookPlace(userEmail, title, place, arrivalTime, departureTime, function(err, result){
			if (err) throw err;
			// console.log("here it comes "+userEmail+" and "+title);
			// res.redirect("/viewPlace");
			database.decrementSlots(title, function (err, result){
				if (err) { throw err; }
				mail.bookPlaceMail(userEmail, title, place, arrivalTime, departureTime);
				res.redirect("/viewPlace");
			});
		});
	});
});

// router.post('/event_register',(req,res)=>{

// 	var email = req.session.email;
// 	var eventId = req.body.eventId;
// 	console.log("from app "+eventId);

// 	database.event_register(email,eventId,function(err,result){
// 		if (err){ 
// 			throw err;
// 	    }
// 	    else{

// 	    	mail.sendTicket(name,eventName,email,attachment,function(error,info){

// 	    		if(err) throw err;
// 	    		console.log("ticket has been mailed");
// 	    		res.redirect("/myEvents");
// 	    	});

// 	    }
// 	});

// });







//Get the co-ordinates of all the events
// router.post('/getCoords',(req,res)=>{

// 	var eventId = req.body.eventId;
// 	console.log("from app "+eventId);
// 	database.getCoords(eventId,function(err,result){
// 		if (err){ 
// 			throw err;
// 	    }
// 	    else{
// 	    	console.log(JSON.stringify(result));
// 	    	res.send(JSON.stringify(result));
// 	    }
// 	});
// });

module.exports = router;