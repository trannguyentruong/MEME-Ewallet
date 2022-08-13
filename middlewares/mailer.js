var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'elwalletlmeme@gmail.com',
      pass: 'memeewallet'
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.sendMailMessage = (sendTo, subject, message) => { 
        //Create mail object
        const emailMessage = {
            from: 'MeMe E-Wallet',
            to: sendTo,
            subject: subject,
            html: message
        };
  
        //Send mail
        transporter.sendMail(emailMessage)
}