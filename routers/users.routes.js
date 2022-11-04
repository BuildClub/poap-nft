const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel.js');
const Request = require('../models/Request.js');
const generateToken = require('../utils/generateToken.js');
const isAuth = require('../utils/isAuth.js');
const isAdmin = require('../utils/isAdmin.js');
const uuidv1 = require('uuidv1');
const sendResetMail = require('../utils/sendResetMail.js');

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (e) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

userRouter.post('/forgot', async (req, res) => {
  try {
    const thisUser = await User.findOne({ email: req.body.email });
    if (!thisUser) {
      return res.status(404).send({ message: 'User with this email not found' });
    }
    const id = uuidv1();
    const request = new Request({
      email: thisUser.email,
      id,
    });
    await request.save();
    sendResetMail(thisUser.email, id);
    res.status(200).json({ message: 'Email have been sent' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

userRouter.patch('/reset', async (req, res) => {
  try {
    const thisRequest = await Request.findOne({ id: req.body.id });
    if (thisRequest) {
      const user = await User.findOne({ email: thisRequest.email });
      const hashed = await bcrypt.hash(req.body.password, 10);
      user.password = hashed;
      await user.save();
      res.status(204).json({ message: 'Password updated' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

userRouter.get('/checkAuth', isAuth, async (req, res) => {
  try {
    res.status(201).send({
      message: 'Valid token',
    });
  } catch (e) {
    res.status(401).send({ message: 'Unauthorized user' });
  }
});

userRouter.post('/login', async (req, res) => {
  console.log('req.body login', req.body);
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({ message: 'User with this email not found' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(404).json({ message: 'Wrong password' });
    }

    res.status(201).send({
      email: user.email,
      isAdmin: user.isAdmin,
      userId: user._id,
      token: generateToken(user),
    });
  } catch (e) {
    res.status(403).send({ message: 'Invalid email or password' });
  }
});

userRouter.post('/register', async (req, res) => {
  console.log('req.body', req.body);
  try {
    const checkEmail = await User.findOne({ email: req.body.email });

    if (checkEmail) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    console.log('user', user);

    const createdUser = await user.save();

    console.log('createdUser', createdUser);

    res.status(201).send({
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      userId: createdUser._id,
      token: generateToken(createdUser),
    });
  } catch (e) {
    console.log('ERROR', e);
    res.status(500).send({ message: 'Something went wrong' });
  }
});

userRouter.delete('/:id', isAuth, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  console.log(user);
  if (user) {
    const deletedUser = await user.remove();
    res.send({ message: 'Пользователь удалён', user: deletedUser });
  } else {
    res.status(404).send({ message: 'Пользователь не найден' });
  }
});

userRouter.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).send({ message: 'Пользователь не найден' });
  }
});

module.exports = userRouter;
