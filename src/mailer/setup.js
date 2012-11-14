var nodemailer = require('nodemailer'),
 codeError = require('../routes/errorHandlers.js').codeError;


var MAIL_TO = "rvidal@extrema-sistemas.com",
  MAIL_SUBJECT = "InstructorMatters contact";

var transport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    XOAuthToken: nodemailer.createXOAuthGenerator({
        user: 'info@extrema-sistemas.com',
        token: '1/FMeGZPPHzish_PtQKqGmdTjPFy0sUIFFvuLv-UvDot8',
        tokenSecret: 'l0zCd5oWC4jx48Ccas-uC0K2'
    })
  }
});

exports.sendMail = function (req, res) {
  var contactRequest = req.body;

  contactRequest['to'] =  req.instructorEmail || MAIL_TO;
  contactRequest['subject'] = MAIL_SUBJECT;

  console.log('Sending contact mail ' + JSON.stringify(contactRequest));
  contactRequest.replyTo = contactRequest.senderName + " <" + contactRequest.from + ">";
  
  transport.sendMail(contactRequest, function (error, responseStatus) {
    if (!error) {
         // lets shut down the connection pool
        res.send(201, responseStatus.message? responseStatus.message : 'Mail sent');      
    } else {
      console.log("Error sending contactRequest " + JSON.stringify(contactRequest) 
        + "\n. Error: " + error);
      codeError(500, error.message);
    }
    transport.close();
  });
};  



