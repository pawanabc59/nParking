var nodemailer = require('nodemailer');

function sendMail(name,password,email,role){

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_email_password'
    }
  });

  var mailOptions = {
    from: 'Admin <your_email@gmail.com>',
    to: email,
    subject: 'Account created as '+role+' from Online Parking',
    text: 'Hey '+name+', Admin here. \nYou have been successfully registered on Parking and your password is '+password+'.\n\nThanks and Regards,Admin :)'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function placeAddedMail(email, title, address, slots, startTime, endTime){

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_email_password'
    }
  });

  var mailOptions = {
    from: 'Admin <your_email@gmail.com>',
    to: email,
    subject: 'Place Added Successfully - '+title+'.',
    text: 'Hey Owner, Admin here. \n You have successfully registered your place namely '+title+' with the Online Parking .\nYour place is located at '+address+'.\n Starting Time of your place is '+startTime+' and Ending Time is '+endTime+'. \nYour Place have total of '+slots+' slots. \nAll the best for the future.\n\n\nThanks and Regards,Admin :)'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function bookPlaceMail(userEmail, titleOfPlace, slotsInPlace, arrivalTime, departureTime){

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_email_password'
    }
  });

  var mailOptions = {
    from: 'Admin <your_email@gmail.com>',
    to: userEmail,
    subject: 'Booked Parking slot at - '+titleOfPlace+' ',
    text: 'Hey User, Admin here. \n You have booked a parking slot at '+titleOfPlace+'. The place has total of '+slotsInPlace+' slots.\n You should arrive at place by '+arrivalTime+' and should leave the place by '+departureTime+'. Otherwise significant charges will be taken by the place owner. \nAll the best for the future.\n Happy Parking ;)\n\nThanks and Regards,Admin :)',
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// function sendTicket(name,eventName,email,attachment,cb){

//   var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'eventmania82@gmail.com',
//       pass: 'eventmania@1234'
//     }
//   });

//   var mailOptions = {
//     from: 'eventmania82@gmail.com',
//     to: email,
//     subject: 'Successfully Registered',
//     text: 'Hey '+name+', Admin here. You have been successfully registered for '+eventName+'.\nFor more details check the ticket.\n\n\n\nThanks and Regards,Admin :)',
//     attachments: [{
//     filename: 'file.pdf',
//     path: 'C:/wamp/www/EventMania/files/quotation.pdf',//attachment
//     contentType: 'application/pdf'
//   }]
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//       cb(error,info);
//   });

// }


module.exports= { sendMail, placeAddedMail, bookPlaceMail };