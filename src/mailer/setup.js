var nodemailer = require('nodemailer')
 , simple_recaptcha = require('simple-recaptcha')
 , codeError = require('../routes/errorHandlers.js').codeError;


var MAIL_TO = "ehdez@extrema-sistemas.com",
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

    console.log('Sending contact mail ' + JSON.stringify( _.omit(contactRequest, 'recaptcha_response_field','recaptcha_challenge_field')));
    contactRequest.replyTo = contactRequest.senderName + " <" + contactRequest.from + ">";

    if (req.editionURL){
      // El contacto es a través de una edición en concreto, añadimos el enlace a dicha edición
      contactRequest.text = contactRequest.text + '\n--\n' + 
                            contactRequest.editionDate + '\n' +
                            contactRequest.courseName + '\n' +
                            contactRequest.editionVenue + '\n'+
                            req.editionURL;
    }
    
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
    return;

};

exports.checkRecaptcha = function(req, res, next){
  var privateKey = '6Ld6XNkSAAAAAO3RK_Y8iIWi1Ldy3jsS8BQvCU7z'; // your private key here
  var ip = req.ip;
  var challenge = req.body.recaptcha_challenge_field;
  var response = req.body.recaptcha_response_field;

  simple_recaptcha(privateKey, ip, challenge, response, function(err) {
    if (err)  {
      var msg = err.message;
      if (msg === 'incorrect-captcha-sol'){
        msg = 'Incorrect captcha';
      } else if (msg === 'Response is required'){
        msg = 'Captcha missing';
      }
      return res.send(msg);
    }
    next();
  });

}  



