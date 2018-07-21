var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: false}
});

module.exports = mongoose.model('Product', schema); 
