const express = require('express');
const Event = require('../models/EventModel.js');
const isAuth = require('../utils/isAuth.js');
const isAdmin = require('../utils/isAdmin.js');
const Web3 = require('web3');
const ethers = require('ethers');
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
    const web3 = new Web3(process.env.GW_RPC_URL); // Your Web3 instance
    const contractAddress = process.env.CONTRACT_ADDRESS;

    const provider = new ethers.providers.JsonRpcProvider(process.env.GW_RPC_URL);
    const ethersContract = new ethers.Contract(contractAddress, LINKS_NFT_ABI, provider);
    const signer = provider.getSigner('0x91Bbc2A6C3C7006e26Cd1CF6e27B0FeBA94377cE');
    const contractWithSigner = ethersContract.connect(signer);

    const estimation = await contractWithSigner.estimateGas.createEvent(
      req.body.ownerAddress,
      req.body.eventName,
      req.body.eventDescription,
      req.body.email,
      req.body.eventUri,
    );

    const calculateGasMargin = (value) =>
      value
        .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(2500)))
        .div(ethers.BigNumber.from(10000));

    const estimateGasValue = calculateGasMargin(estimation).toString();

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
        gas: estimateGasValue,
        data: trans,
        gasPrice: 400000000000000,
      },
      process.env.SECRET_KEY,
    );

    const tx = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);

    const event = await Event.findOne({ _id: req.body.eventId });

    event.eventOwner = event.temporaryEventOwner;

    const updatedEvent = await event.save();

    res.status(201).send({
      massage: 'Event approved',
    });
  } catch (err) {
    console.log('CREATE ERROR', err.message);
    res.status(500).send({ message: 'Something went wrong', error: err.message });
  }
});

router.post('/addUserToEvent', isAuth, isAdmin, async (req, res) => {
  try {
    const web3 = new Web3(process.env.GW_RPC_URL); // Your Web3 instance
    const contractAddress = process.env.CONTRACT_ADDRESS;

    const provider = new ethers.providers.JsonRpcProvider(process.env.GW_RPC_URL);
    const ethersContract = new ethers.Contract(contractAddress, LINKS_NFT_ABI, provider);
    const signer = provider.getSigner('0x91Bbc2A6C3C7006e26Cd1CF6e27B0FeBA94377cE');
    const contractWithSigner = ethersContract.connect(signer);

    const estimation = await contractWithSigner.estimateGas.addUserToEvent(
      req.body.users,
      req.body.eventId,
    );

    const calculateGasMargin = (value) =>
      value
        .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(2500)))
        .div(ethers.BigNumber.from(10000));

    const estimateGasValue = calculateGasMargin(estimation).toString();

    const contract = new web3.eth.Contract(LINKS_NFT_ABI, contractAddress);

    let trans = contract.methods.addUserToEvent(req.body.users, req.body.eventId).encodeABI();

    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
        value: 0,
        gas: estimateGasValue,
        data: trans,
        gasPrice: 400000000000000,
      },
      process.env.SECRET_KEY,
    );

    const tx = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    res.status(201).send({
      ...tx,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Something went wrong' });
  }
});

router.delete('/:id', isAuth, isAdmin, async (req, res) => {
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
