const nodemailer = require('nodemailer');

module.exports = (email, id) => {
  console.log(email, id);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_NAME,
    to: email,
    subject: 'Reset password instructions',
    text: `To reset your password, please click on this link: ${process.env.DOMEN_NAME}/reset/${id}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('email sent', info.response);
    }
  });
};
