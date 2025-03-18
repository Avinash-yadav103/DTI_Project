const Data = require('../models/dataModel');

const createData = async (req, res) => {
  try {
    const data = new Data(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getData = async (req, res) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createData,
  getData
};