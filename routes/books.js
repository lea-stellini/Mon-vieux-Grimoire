const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config')

const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');

router.post('/', auth, multer, bookCtrl.addBook);
router.get('/', bookCtrl.getAllBooks);

module.exports = router;