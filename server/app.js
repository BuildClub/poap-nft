/** @format */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello');
});
app.use('/sendmail', require('./routers/mail.routes'));

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server run at port: ${PORT}`);
});
