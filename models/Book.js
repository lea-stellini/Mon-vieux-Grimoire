const mongoose = require('mongoose');

// const ratingSchema = mongoose.Schema({
//     userId: { type: String, required: true},
//     grade: { type: Number, required: true, min: 1, max: 5},
// })

const bookSchema = mongoose.Schema({
    userId: { type: String , required: true},
    title: { type: String , required: true },
    author: { type: String , required: true },
    imageUrl: { type: String , required: true },
    year: { type: Number , required: true },
    genre: { type: String , required: true },
    // ratings: {type: [ratingSchema], required: true},
    ratings: [
        {
            userId: { type: String, required: true},    
            grade: { type: Number, required: true, min: 1, max: 5},
        }
    ],
    averageRating: { type: Number, default: 1 }
});

module.exports = mongoose.model('Book', bookSchema);