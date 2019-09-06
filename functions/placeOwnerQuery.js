const con = require('../configuration/databaseConnection.js');
const md5 = require('md5');

function placeOwnerRegistration(firstName, lastName, contactNo, email, password,cb){
	
	var sql = "insert into placeOwnerReg (fname, lname, contactNo, email, password) values ('"+firstName+"','"+lastName+"','"+contactNo+"','"+email+"','"+password+"')";
	con.query(sql, function(err, result){
		cb(err, result);
	});

}

function addPlace(email, title, address, slot, image, startTime, endTime, slotsLeft, cb){
	var sql = "insert into addPlace (email, title, address, slot, image, startTime, endTime, slotsLeft) values('"+email+"','"+title+"','"+address+"','"+slot+"','"+image+"','"+startTime+"','"+endTime+"','"+slotsLeft+"')";
	con.query(sql, function(err, result){
		cb(err, result);
	});
}


// function organiserRegistration(firstName,lastName,hash,contactNumber,city,email,instituteName,cb){

// 	  var sql = "INSERT INTO organiser VALUES('"+firstName+"','"+lastName+"','"+hash+"','"+contactNumber+"','"+city+"','"+email+"','"+instituteName+"')";
// 	  con.query(sql, function (err, result) {
// 	  	cb(err,result);
// 	  });

// }


// function eventRegistration(eventName,organiserEmail,venue,startDate,endDate,startTime,endTime,noOfVolunteers,quotation,description,latitude,longitude,contactDetails,image,cb){

// 	  var sql = "INSERT INTO event_details(eventName,organiserEmail,venue,startDate,endDate,startTime,endTime,noOfVolunteers,quotation,description,latitude,longitude,contactDetails,image) VALUES('"+eventName+"','"+organiserEmail+"','"+venue+"','"+startDate+"','"+endDate+"','"+startTime+"','"+endTime+"','"+noOfVolunteers+"','"+quotation+"','"+description+"','"+latitude+"','"+longitude+"','"+contactDetails+"','"+image+"')";
// 	  con.query(sql, function (err, result) {
// 	  	cb(err,result);
// 	  });

// }

// function myEvents(email,cb){
	  		
// 	  		var sql = "select eventId,eventName,venue,startTime,startDate,endTime,endDate,description,contactDetails,image from event_details where organiserEmail = '"+email+"';";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});

// }

// function getRegisteredVolunteers(eventId,cb){
	  		
// 	  		var sql = "select fname,lname,contactNo from volunteer where email in(select email from volunteer_event_rel where eventId = '"+eventId+"');";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});

// }


module.exports = { placeOwnerRegistration, addPlace }
