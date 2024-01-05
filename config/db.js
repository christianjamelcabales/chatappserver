const mongoose = require('mongoose');

const dbConnect = async () =>{
    try {
        await mongoose.connect('mongodb+srv://cjcabales:easybreezy123@cluster0.qzagfaz.mongodb.net/app1');
        console.log('Connected to Database')
      } catch (error) {
        console.log(error)
      }
}

module.exports = dbConnect


