var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport("SMTP",{
    host: "smtp.gmail.com"
    , secureConnection: true
    , port: 465
    , auth: {
        user: "info@extrema-sistemas.com"
        , pass: "espartanos2011"
    }
});

exports.sendMail = function(contactRequest) {
  contactRequest.replyTo = contactRequest.from;
  transport.sendMail(contactRequest,  function(error){
    if(error) {
        console.log("Error sending contactRequest " + JSON.stringify(contactRequest) 
            + "\n. Error: " + error);
    }
    transport.close(); // lets shut down the connection pool
  });        
}
