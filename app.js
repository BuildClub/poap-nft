const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('node:path');
const app = express();
const path = require('path');

dotenv.config();

app.use(cors());
app.use(express.json({ extended: true }));

app.use('/sendmail', require('./routers/mail.routes'));

app.use('/users', require('./routers/users.routes'));

app.use('/events', require('./routers/events.routes'));

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  console.log('Database connected'),
);

app.use('/', express.static('build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server run at port: ${PORT}`);
});
