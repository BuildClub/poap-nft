const nodemailer = require('nodemailer');

module.exports = (email, id) => {
  console.log(email, id);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'oleksandrmegadev@gmail.com',
      pass: 'csfzvdccqxlhxbyh',
    },
  });

  const mailOptions = {
    from: `oleksandrmegadev@gmail.com`,
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
