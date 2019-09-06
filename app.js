const http = require('http');
const express =require('express');
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



let uploadData = multer();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));


//functions
//const mail = require('./functions/mail.js');
const con = require('./configuration/databaseConnection.js');


//setting the template engine
app.set('view engine','ejs');

//session maintaining
app.use(session({secret:'noneed', resave: false, saveUninitialized: true}));

// by using locals we can access the session variable anywhere in the templates.
app.use(function(req, res, next){
	res.locals.email = req.session.email;
	res.locals.roles = req.session.roles;
	// res.locals.roles = req.session.userId;
	res.locals.status = "400";
	next();
});



//AJAX
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req,res){
	res.send('<div class="alert alert-success alert-dismissible"> <button type="button" class="close" data-dismiss="alert">&times;</button>  <strong>Success!</strong> Indicates a successful or positive action.</div>');
});


// //router
const carOwner = require('./routes/carOwner.js');
const placeOwner = require('./routes/placeOwner.js');
// const donar = require('./routes/donar.js');
const database = require("./functions/login.js");
const carOwnerQuery = require("./functions/carOwnerQuery.js");

app.use('/carOwner',carOwner);
app.use('/placeOwner',placeOwner);
// app.use('/donar',donar);

app.get('/home',(req,res)=>{

	console.log("inside");
	if (req.session.email) {
		console.log(req.session.email);
		console.log("in session");
		res.render("home", {email: req.session.email, roles: req.session.roles});

	}
	else{
		res.render("home");
	}
});

// app.get('/viewPlace',(req,res)=>{

// 	console.log("inside");
// 	if (req.session.email) {
// 		console.log(req.session.email);
// 		console.log("in session");
// 		carOwnerQuery.viewPlaces(function(err, results){
// 			if (err) throw err;
// 			var sql = "select * from bookedPlace where userEmail = '"+req.session.email+"' ORDER BY id DESC LIMIT 1";
// 			con.query(sql, function(err, results1){
// 				console.log("results1 :"+JSON.stringify(results1));
// 				var temp_pass = JSON.stringify(results1[0].title);
// 				var temp2_pass= temp_pass.replace(/\"/g, "");
// 				console.log("it should show the title "+temp2_pass);
// 				carOwnerQuery.incrementSlots(temp2_pass, function(err, result){
// 				res.render("viewPlace", {results: results , email: req.session.email, roles: req.session.roles});
// 			});
// 			});	
			
// 		});

// 	}
// 	else{
// 		console.log("out session");
// 		carOwnerQuery.viewPlaces(function(err, results){
// 			if (err) throw err;
// 			carOwnerQuery.incrementSlots("",function(err, result){
// 				res.render("viewPlace", {results: results , email: req.session.email, roles: req.session.roles});
// 			});
// 		});
// 		// res.render("home");
// 	}
// });

app.get('/viewPlace',(req,res)=>{

	console.log("inside");
	if (req.session.email) {
		console.log(req.session.email);
		console.log("in session");
		carOwnerQuery.viewPlaces(function(err, results){
			if (err) throw err;
			carOwnerQuery.incrementSlots(function(err, result){
				if (err) throw err;
			});
			res.render("viewPlace", {results: results , email: req.session.email, roles: req.session.roles});
			
		});

	}
	else{
		console.log("out session");
		carOwnerQuery.viewPlaces(function(err, results){
			if (err) throw err;
			carOwnerQuery.incrementSlots(function(err, result){
				if (err) throw err;
			});
				res.render("viewPlace", {results: results , email: req.session.email, roles: req.session.roles});
		});
		// res.render("home");
	}
});

app.get('/login', function(req,res){
	res.render("login");
});

app.post('/login', function(req,res){
	var email = req.body.email;
	var password = req.body.password;
	var hash = md5(password);
	var optradio = req.body.optradio;

	if (optradio == "carOwner") {
		database.carOwnerLogin(email, hash, function(err, result){
			if (err) {throw err;}
			if (result.length == 1) {
				var temp_pass = JSON.stringify(result[0].password);
				var temp2_pass = temp_pass.replace(/\"/g, "");

				if (hash == temp2_pass) {
					req.session.email = req.body.email;
					req.session.roles = "carOwner";
					console.log("Correct password")
					res.redirect("/home");
				}
				else{
					console.log("Incorrect password");
					res.render("login");
				}
			}
			else{
				console.log("username not found");
				res.render("login");	
			}
		});
	}
	if (optradio == "placeOwner") {
		database.placeOwnerLogin(email, hash, function(err, result){
			if (err) {throw err;}
			if (result.length == 1) {
				var temp_pass = JSON.stringify(result[0].password);
				var temp2_pass = temp_pass.replace(/\"/g, "");

				if (hash == temp2_pass) {
					req.session.email = req.body.email;
					req.session.roles = "placeOwner";
					console.log("Correct password")
					res.redirect("/home");
				}
				else{
					console.log("Incorrect password");
					res.render("login");
				}
			}
			else{
				console.log("username not found");
				res.render("login");	
			}
		});
	}
});

app.get('/logout',function(req,res){    
    req.session.destroy(function(err){  
        if(err){  
            console.log(err);  
        }  
        else  
        {  
            res.redirect('/login');  
        }  
    });  

});

app.listen(8060);