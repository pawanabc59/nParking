const con = require('../configuration/databaseConnection.js');
const md5 = require('md5');

function placeOwnerLogin(email,hash,cb){

	  		var sql = "select password from placeOwnerReg where email='"+email+"';";
			con.query(sql,function(err,result,fields){
			cb(err,result);
			});
}

function carOwnerLogin(email,hash,cb){

	  		var sql = "select password from carOwnerReg where email='"+email+"';";
			con.query(sql,function(err,result,fields){
			cb(err,result);
			});
}

module.exports = { placeOwnerLogin , carOwnerLogin }
