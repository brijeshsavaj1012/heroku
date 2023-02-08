const mongoose = require('mongoose') 

const userSchem = new mongoose.Schema({
    name:{
      type:String,
      require:true
    },
    age:{
      type:String,
      require:true
    }
  })
const abc = mongoose.model('abc',userSchema)
  module.exports = abc;
