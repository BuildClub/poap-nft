/** @format */

const express = require('express');
const bcrypt = require('bcrypt');
const Event = require('../models/EventModel.js');
const generateToken = require('../utils/generateToken.js');
const isAuth = require('../utils/isAuth.js');
const isAdmin = require('../utils/isAdmin.js');
const Web3 = require('web3');
const LINKS_NFT_ABI = require('../client/src/modules/web3/abi/LinksNFT.json');

const router = express.Router();

router.get('/', isAuth, async (req, res) => {
  try {
    const events = await Event.find({});
    return res.status(200).json(events);
  } catch (e) {
    console.log('EVENTS ERROR', e);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/', isAuth, async (req, res) => {
  try {
    const event = new Event({
      eventName: req.body.eventName,
      eventDescription: req.body.eventDescription,
      eventUri: req.body.eventUri,
      eventImage: req.body.eventImage,
      email: req.body.email,
      temporaryEventOwner: req.user._id,
      ownerAddress: req.body.address,
    });

    const createdEvent = await event.save();

    res.status(201).send({
      eventName: createdEvent.eventName,
    });
  } catch (e) {
    console.log('ERROR', e);
    res.status(500).send({ message: 'Something went wrong' });
  }
});

router.post('/createEvent', isAuth, isAdmin, async (req, res) => {
  try {
    const web3 = new Web3('https://godwoken-testnet-v1.ckbapp.dev'); // Your Web3 instance
    const contractAddress = '0xdcbd950F8246cD1e2f4Da41CD91219abEB823935';
    // const contractAddress = '0xDafeE33922AAF21DF0bE49FA44E4642d067361a0';

    const contract = new web3.eth.Contract(LINKS_NFT_ABI, contractAddress);

    let trans = contract.methods
      .createEvent(
        req.body.ownerAddress,
        req.body.eventName,
        req.body.eventDescription,
        req.body.email,
        req.body.eventUri,
      )
      .encodeABI();

    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
        value: 0,
        gas: '500000',
        data: trans,
        gasPrice: 400000000000000,
      },
      process.env.SECRET_KEY,
    );

    const tx = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);

    const event = await Event.findOne({ _id: req.body.eventId });

    event.eventOwner = event.temporaryEventOwner;

    const updatedEvent = await event.save();

    // console.log('updatedEvent', updatedEvent);

    // console.log('TX', tx);

    res.status(201).send({
      massage: 'Event approved',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Something went wrong' });
  }
});

router.post('/addUserToEvent', isAuth, isAdmin, async (req, res) => {
  try {
    const web3 = new Web3('https://godwoken-testnet-v1.ckbapp.dev'); // Your Web3 instance
    const contractAddress = '0xdcbd950F8246cD1e2f4Da41CD91219abEB823935';
    // const contractAddress = '0xDafeE33922AAF21DF0bE49FA44E4642d067361a0';

    const contract = new web3.eth.Contract(LINKS_NFT_ABI, contractAddress);

    let trans = contract.methods.addUserToEvent(req.body.users, req.body.eventId).encodeABI();

    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
        value: 0,
        gas: '500000',
        data: trans,
        gasPrice: 400000000000000,
      },
      process.env.SECRET_KEY,
    );

    const tx = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);

    console.log('TX', tx);

    res.status(201).send({
      ...tx,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Something went wrong' });
  }
});

// router.put('/update', isAuth, async (req, res) => {
//   try {
//     console.log(req.body);
//     const user = await Event.findOne({ _id: req.user._id });
//     user.first_name = req.body.first_name;
//     user.last_name = req.body.last_name;
//     user.phone_number = req.body.phone_number;
//     user.email = req.body.email;
//     const updatedEvent = await user.save();
//     console.log(updatedEvent);
//     const response = {
//       _id: updatedEvent._id,
//       first_name: updatedEvent.first_name,
//       last_name: updatedEvent.last_name,
//       username: updatedEvent.username,
//       phone_number: updatedEvent.phone_number,
//       email: updatedEvent.email,
//       token: generateToken(updatedEvent),
//       image: updatedEvent.image,
//       isAdmin: updatedEvent.isAdmin,
//     };
//     return res.status(201).json({
//       message: 'Профиль обновлён',
//       response,
//     });
//   } catch (e) {
//     res.status(500).send({ message: 'Something went wrong' });
//   }
// });

router.delete('/:id', isAuth, isAdmin, async (req, res) => {
  console.log('req.params.id', req.params.id);
  const event = await Event.findById(req.params.id);
  console.log(event);
  if (event) {
    const deletedEvent = await event.remove();
    res.send({ message: 'Event deleted', event: deletedEvent });
  } else {
    res.status(404).send({ message: 'Event not found' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    res.status(200).json(event);
  } catch (error) {
    res.status(404).send({ message: 'Event not found' });
  }
});

module.exports = router;
