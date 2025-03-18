const express = require('express');
const { createData, getData } = require('../controllers/dataController');

const router = express.Router();

router.post('/', createData);
router.get('/', getData);

module.exports = router;