const Book = require('../models/Book')

exports.addBook = (req, res, next) => {
    console.log(req.body)
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId
    });
    book.save()
    .then(() => res.status(201).json({message: 'Livre enregistré !'}))
    .catch(error => res.status(400).json( { error }))
}

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then((books) => {res.status(200).json(books)})
    .catch((error) => {res.status(400).json({error})});
}