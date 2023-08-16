const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');

router.post('/', auth, bookCtrl.addBook);
router.get('/', bookCtrl.getAllBooks);

module.exports = router;