var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    Password: {type: String, required: true}
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password){
   // console.log(this.Password);
     //   console.log(password);
    
        return bcrypt.compareSync(password, this.Password);
  
};

module.exports = mongoose.model('User', userSchema);