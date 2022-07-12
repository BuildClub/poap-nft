const express = require('express');
const nodemailer = require('nodemailer');

const mailRouter = express.Router();

mailRouter.post('/', (req, res) => {
  console.log(req.body);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'oleksandrmegadev@gmail.com',
      pass: 'csfzvdccqxlhxbyh',
    },
  });

  const mailOptions = {
    from: `oleksandrmegadev@gmail.com`,
    to: `${req.body.to}`,
    subject: `You had received the memo nft`,
    text: `Test`,
    html: ' Hello '.concat(
      '</br > <br /> Here is the link of the memo nft : <a href="https://localhost:3000/">Claim nft</a><br /><br /> Best Regards.',
    ),
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('email sent', info.response);
      res.status(200).json({ message: 'Emnail have been sent' });
    }
  });
});

module.exports = mailRouter;
