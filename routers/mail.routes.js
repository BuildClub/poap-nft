const express = require('express');
const nodemailer = require('nodemailer');

const mailRouter = express.Router();

mailRouter.post('/', (req, res) => {
  console.log(req.body);
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: false,
    requireTLS: true,
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_NAME,
    to: `${req.body.to}`,
    subject: req.body.subject,
    // subject: `You have received the memo nft`,
    text: ``,
    html: ' Dear User, '
      .concat(req.body.html)
      .concat('</br > <br /><a href="https://collectpups.com">'),
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('email sent', info.response);
      res.status(200).json({ message: 'Email have been sent' });
    }
  });
});

module.exports = mailRouter;
