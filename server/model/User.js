const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    //this is the name object
    name: {
        type: String,
        required: true 
    }, 
    email: {
        type: String,
        required: true, 
        unique: true
    }, 
    password: {
        type: String, 
        required: true,
        minlength: 6
    }
})

//export as a module
//                              name as a string, Schema
module.exports = mongoose.model('User', userSchema);
//check this again
//it will be stored as user