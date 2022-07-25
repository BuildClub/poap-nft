/** @format */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('node:path');
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json({ extended: true }));

app.use('/sendmail', require('./routers/mail.routes'));

app.use('/', express.static('build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server run at port: ${PORT}`);
});
