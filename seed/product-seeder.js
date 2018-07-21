var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true }, err => {
    if (err) throw err;
    console.log(`Successfully connected to database.`);
});

var products = [
    new Product({
        imagePath: 'https://m.media-amazon.com/images/S/aplus-media/mg/a48e575c-d047-4ba5-89b0-1c8977511564.png',
        title: 'Calculator',
        description: 'Super Fast',
        price: 15
    }),
    new Product({
        imagePath: 'https://m.media-amazon.com/images/S/aplus-media/mg/a48e575c-d047-4ba5-89b0-1c8977511564.png',
        title: 'Calculator',
        description: 'Super Fast',
        price: 15
    }),
    new Product({
        imagePath: 'https://m.media-amazon.com/images/S/aplus-media/mg/a48e575c-d047-4ba5-89b0-1c8977511564.png',
        title: 'Calculator',
        description: 'Super Fast',
        price: 15
    }),
    new Product({
        imagePath: 'https://m.media-amazon.com/images/S/aplus-media/mg/a48e575c-d047-4ba5-89b0-1c8977511564.png',
        title: 'Calculator',
        description: 'Super Fast',
        price: 15
    }),
    new Product({
        imagePath: 'https://images-na.ssl-images-amazon.com/images/I/51oipw32UkL._SX679_.jpg',
        title: 'Pencil',
        description: 'Super Cool',
        price: 15
    })
];

var done = 0;
for(var i = 0; i < products.length; i++){
    products[i].save((err,result) => {
        done++;
        if(done == products.length){
           exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}