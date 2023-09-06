const Book = require('../models/Book');
const fs = require('fs');

exports.addBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    
    delete bookObject._id;
    delete bookObject.userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.compressedFilename}`
    });
    
    book.save()
    .then(() => res.status(201).json({message: 'Livre enregistré !'}))
    .catch(error => res.status(400).json( { error }))
}

exports.addRating = (req, res, next) => {
    const ratingObject = req.body
    
    delete ratingObject.userId;

    let rating = {
        userId: req.auth.userId,
        grade: ratingObject.rating
    }

    Book.findOne({_id: req.params.id})
    .then(book => {
        const notAuthorized = book.ratings.find(user => user.userId === rating.userId)
        if(notAuthorized){
            res.status(401).json({message: 'Non autorisé'});
        } else {   
            const sumRating = book.ratings.reduce((sum, rating) => sum + rating.grade , 0 );
            
            const newAverageRating = ((sumRating + rating.grade) / (book.ratings.length + 1)).toFixed(0);

            Book.findByIdAndUpdate({_id: req.params.id}, {$push:{ratings: rating}, averageRating: newAverageRating}, {new: true})
            .then( book => {res.status(200).json(book)})
            .catch((error) => { res.status(400).json({error})})
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    })
} 

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        // si je modifie l'image
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.compressedFilename}`
    } : { ...req.body};
    
    delete bookObject.userId;
    Book.findOne({_id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId){
            res.status(401).json({message: 'Non autorisé'});
        } else {
            Book.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
            .then(() =>
                res.status(200).json({message: 'Livre modifié!'}))
            .catch(error => 
                res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        })
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        if( book.userId != req.auth.userId) {
            res.status(401).json({message: 'Non autorisé !'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message: 'Livre supprimé !'}))
                .catch(error => res.status(401).json({error}));
            })

        }
    })
    .catch(error => res.status(500).json({error})) 
}

exports.getBestratingBooks = (req, res, next) => {
    Book.find()
    .then(books => {
        const bestRatingArray = books.sort((a,b) => b.averageRating - a.averageRating).slice(0, 3);
 
        res.status(200).json(bestRatingArray)
    })
    .catch((error) => {res.status(400).json({error})});
 }

exports.getOneBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(books => res.status(200).json(books))
    .catch(error => res.status(404).json({error}));
}

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then((books) => {res.status(200).json(books)})
    .catch((error) => {res.status(400).json({error})});
}