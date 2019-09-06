const con = require('../configuration/databaseConnection.js');
const md5 = require('md5');

function carOwnerRegistration(firstName, lastName, contactNo, email, password,cb){
	
	var sql = "insert into carOwnerReg (fname, lname, contactNo, email, password) values ('"+firstName+"','"+lastName+"','"+contactNo+"','"+email+"','"+password+"')";
	con.query(sql, function(err, result){
		cb(err, result);
	});

}

function viewPlaces(cb){

	var sql = "select * from addPlace";
	con.query(sql, function(err, result){
		cb(err, result);
	});
}

function bookPlace(email, title, place, arrivalTime, departureTime, cb){

	var sql = "insert into bookedPlace (userEmail, title, place, arrivalTime, departureTime, dateOfBooking, exitSlot) values ('"+email+"', '"+title+"', '"+place+"', '"+arrivalTime+"', '"+departureTime+"', current_timestamp(), 0)";
	con.query(sql, function(err, result){
		cb(err, result);
	});

}

function decrementSlots(title, cb){

	var sql = "UPDATE `addPlace` SET `slotsLeft`= `slotsLeft` - 1 WHERE title = '"+title+"' and `slotsLeft` > 0";
	con.query(sql, function(err, result){
		cb(err, result);
	});

}

function incrementSlots(cb){

	var sql = "select * from addPlace";
	con.query(sql, function(err, results){
		// cb(err, result);
		results.forEach(function(row){
			var slotsLeft = row.slotsLeft;
			var title = row.title;
			var sql1 = "update `addPlace` set `slotsLeft` = if ((select `departureTime` from `bookedPlace` where `exitSlot` = 0 order by id ASC limit 1) < (select current_timestamp()), '"+(slotsLeft+1)+"', '"+slotsLeft+"') where title = (select title from bookedPlace where exitSlot = 0 and departureTime < current_timestamp() order by id ASC limit 1)";

			// title = '"+title+"';";

			con.query(sql1, function(err, results1){
				var sql2 = "update `bookedPlace` set `exitSlot` = 1 where `exitSlot` = 0 and departureTime < current_timestamp()";
				con.query(sql2, function(err, result){
					cb(err, result);
				});
				
			});
		});
	});
}

// function staffRegistration(branch,firstName,lastName,hash,email,contactNumber,role,regDate,cb){

// 	  var sql = "INSERT INTO staff (fname, lname, branch, email, password, contactNo, role, regDate) VALUES ('"+firstName+"','"+lastName+"','"+branch+"','"+email+"','"+hash+"','"+contactNumber+"','"+role+"','"+regDate+"' )";
// 	  con.query(sql, function (err, result) {
// 	  	cb(err,result);
// 	  });

// }


// function recruiterRegistration(name,companyName,hash,email,contactNumber,regDate,cb){

// 	  var sql = "INSERT INTO recruiter (company, name, contactNo, password, regDate, email) VALUES ('"+companyName+"','"+name+"','"+contactNumber+"','"+hash+"','"+regDate+"','"+email+"')";
// 	  con.query(sql, function (err, result) {
// 	  	cb(err,result);
// 	  });

// }


// function eventRegistration(event,club,year,faculty,date,cb){

// 	  var sql = "INSERT INTO events (name, club, date, faculty, reg_date) VALUES ('"+event+"','"+club+"','"+year+"','"+faculty+"','"+date+"')";
// 	  con.query(sql, function (err, result) {
// 	  	cb(err,result);
// 	  });

// }


// function staffLogin(username,hash,cb){

// 	  		var sql = "select password, role from staff where sId='"+username+"';";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});
// }


// function recruiterLogin(username,hash,cb){

// 	  		var sql = "select password from recruiter where rId= '"+username+"';";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});
// }

// function getEventsParticipated(username,cb){
	  		
// 	  		var sql = "select name,club from events where eId in(select eId from stud_event where username = '"+username+"');";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});

// }

// function setRequestList(rId,username,eId,cb){
	  		
// 	  		var sql = "INSERT INTO request_list VALUES ('"+rId+"','"+eId+"','"+username+"',1)";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});

// }


// function getStaffId(email,cb){

// 		  	var sql = "select sId from staff where email = '"+email+"' ";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});

// }

// function getRecruiterId(email,cb){

// 		  	var sql = "select rId from recruiter where email = '"+email+"' ";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});

// }

// function getStaffDetails(cb){

// 		  	var sql = "select * from staff;";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }

// function editStaff(fname,lname,email,password,contactNo,role,sid,cb){

// 		  	var sql = "UPDATE staff SET fname = '"+fname+"', lname = '"+lname+"', email = '"+email+"', password = '"+md5(password)+"', contactNo = '"+contactNo+"', role = '"+role+"' WHERE sId = '"+sid+"';";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }

// function getRecruiterDetails(cb){

// 		  	var sql = "select * from recruiter;";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }

// function editRecruiter(company,name,email,password,contactNo,rid,cb){

// 		  	var sql = "UPDATE recruiter SET company = '"+company+"', name = '"+name+"', email = '"+email+"', password = '"+md5(password)+"', contactNo = '"+contactNo+"' WHERE rId = '"+rid+"';";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }

// function getEventsDetails(cb){

// 		  	var sql = "select * from events;";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }

// function editEvents(eventName,clubName,eventDate,facultyName,eid,cb){

// 		  	var sql = "UPDATE events SET name = '"+eventName+"', club = '"+clubName+"', date = '"+eventDate+"', faculty = '"+facultyName+"' WHERE eId = '"+eid+"';";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }

// function deleteStaff(staffId,cb){

// 		  	var sql = "DELETE FROM staff WHERE sId = '"+staffId+"';";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }

// function deleteEvent(eventId,cb){

// 		  	var sql = "DELETE FROM events WHERE eId = '"+eventId+"';";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }

// function deleteRecruiter(recruiterId,cb){

// 		  	var sql = "DELETE FROM recruiter WHERE rId = '"+recruiterId+"';";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }


// function getHodFromFaculty(sId,cb){

// 		  	var sql = "select sId,fname,lname,branch from staff where role = 'hod' and branch in (select branch from staff where sId = '"+sId+"');";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }

// function setHodApproval(staffId,eId,branch,hodId,csv_path,cb){

// 		  	var sql = "insert into hod_approval(staffId,eId,branch,hodId,csv_path)  values('"+staffId+"','"+eId+"','"+branch+"','"+hodId+"','"+csv_path+"');";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }


// function setLocation(eId,filename,cb){

// 		  	var sql = "UPDATE events SET filename = '"+filename+"' where eId = '"+eId+"' ;";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }

// function volunteerRegistration(firstName,lastName,hash,contactNumber,city,email,qualification,field_of_interest,resume_path,cb){

// 	  var sql = "INSERT INTO volunteer VALUES('"+firstName+"','"+lastName+"','"+hash+"','"+contactNumber+"','"+city+"','"+email+"','"+qualification+"','"+field_of_interest+"','"+resume_path+"')";
// 	  con.query(sql, function (err, result) {
// 	  	cb(err,result);
// 	  });

// }



// function getCoords(eventId,cb){

// 		  	var sql = "select latitude,longitude from eventDetails where eventId = '"+eventId+"' ;";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});	
// }


// function myEvents(email,cb){
	  		
// 	  		var sql = "select eventId,eventName,venue,startTime,startDate,endTime,endDate,description,contactDetails,image from event_details where eventId in(select eventId from volunteer_event_rel where email='"+email+"');";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});

// }



// function event_register(email,eventId,cb){
	  		
// 	  		var sql = "INSERT INTO volunteer_event_rel VALUES('"+email+"','"+eventId+"',0,0)";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});

// }



// function myCertificates(email,cb){
	  		
// 	  		var sql = "select eventId,eventName,venue,startTime,startDate,endTime,endDate,description,contactDetails,image from event_details where organiserEmail = '"+email+"';";
// 			con.query(sql,function(err,result,fields){
// 			cb(err,result);
// 			});

// }

module.exports = { carOwnerRegistration, viewPlaces, bookPlace, decrementSlots, incrementSlots }
