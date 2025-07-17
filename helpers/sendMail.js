    const nodemailer = require('nodemailer');
module.exports.sendMail = (email,subject,html) =>{
    // Create a transporter object using SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or 'smtp.example.com' for a custom SMTP server
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS // Your email password or app-specific password
        }
    });

        const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address,
        to: email, // Recipient address(es)
        subject: subject, // Subject line
        html: html // HTML body (optional)
    };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}
