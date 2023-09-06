const mongoose = require('mongoose');


const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true},
    grade: { type: Number, required: true, min: 0, max: 5},
})

const bookSchema = mongoose.Schema({
    userId: { type: String , required: true},
    title: { type: String , required: true },
    author: { type: String , required: true },
    imageUrl: { type: String , required: true },
    year: { type: Number , required: true },
    genre: { type: String , required: true },
    ratings: {type: [ratingSchema], required: true},
    averageRating: { type: Number, default: 0 }
});

// pour effacer index quand userId unique
// const Book = mongoose.model('Book', bookSchema);

// Book.syncIndexes();

module.exports = mongoose.model('Book', bookSchema);