/** @format */

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel.js');
const generateToken = require('../utils/generateToken.js');
const isAuth = require('../utils/isAuth.js');
const isAdmin = require('../utils/isAdmin.js');

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (e) {
    return res.status(500).json({ message: 'Something went wrong' });
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

// userRouter.put('/update', isAuth, async (req, res) => {
//   try {
//     console.log(req.body);
//     const user = await User.findOne({ _id: req.user._id });
//     user.first_name = req.body.first_name;
//     user.last_name = req.body.last_name;
//     user.phone_number = req.body.phone_number;
//     user.email = req.body.email;
//     const updatedUser = await user.save();
//     console.log(updatedUser);
//     const response = {
//       _id: updatedUser._id,
//       first_name: updatedUser.first_name,
//       last_name: updatedUser.last_name,
//       username: updatedUser.username,
//       phone_number: updatedUser.phone_number,
//       email: updatedUser.email,
//       token: generateToken(updatedUser),
//       image: updatedUser.image,
//       isAdmin: updatedUser.isAdmin,
//     };
//     return res.status(201).json({
//       message: 'Профиль обновлён',
//       response,
//     });
//   } catch (e) {
//     res.status(500).send({ message: 'Something went wrong' });
//   }
// });

// userRouter.put("/updateBalance", isAuth, async (req, res) => {
//   try {
//     console.log(req.body);
//     const user = await User.findOne({ _id: req.user._id });
//     user.balance = req.body.balance;
//     const updatedUser = await user.save();
//     console.log(updatedUser);
//     const response = {
//       _id: updatedUser._id,
//       first_name: updatedUser.first_name,
//       last_name: updatedUser.last_name,
//       username: updatedUser.username,
//       phone_number: updatedUser.phone_number,
//       email: updatedUser.email,
//       token: generateToken(updatedUser),
//       image: updatedUser.image,
//       isAdmin: updatedUser.isAdmin,
//       balance: updatedUser.balance,
//     };
//     return res.status(201).json({
//       message: "Баланс обновлён",
//       response,
//     });
//   } catch (e) {
//     res.status(500).send({ message: "Something went wrong" });
//   }
// });

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
