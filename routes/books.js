const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config');

const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');

router.post('/', auth, multer, sharp, bookCtrl.addBook);
router.post('/:id/rating', auth, bookCtrl.addRating);
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/bestrating', bookCtrl.getBestratingBooks);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBooks);


module.exports = router;