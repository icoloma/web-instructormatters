var nodemailer = require('nodemailer');
var MAIL_TO = "ehdez@extrema-sistemas.com";
var MAIL_SUBJECT = "InstructorMatters contact";

var transport = nodemailer.createTransport("SMTP",{
    host: "smtp.gmail.com"
    , secureConnection: true
    , port: 465
    , auth: {
        user: "info@extrema-sistemas.com"
        , pass: "espartanos2011"
    }
});



exports.sendMail = function(req, res) {
  var contactRequest = req.body;
  contactRequest['to'] =  MAIL_TO;
  contactRequest['subject'] = MAIL_SUBJECT;
  console.log('Sending contact mail ' + JSON.stringify(contactRequest));
  contactRequest.replyTo = contactRequest.senderName + " <" + contactRequest.from + ">";
  transport.sendMail(contactRequest, function(error, responseStatus) {
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



