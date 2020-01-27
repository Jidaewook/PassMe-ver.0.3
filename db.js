const mongoose = require('mongoose');

mongoose.connect(process.env.DB || "mongodb+srv://psatdoctor:asdf1q@w@cluster0-rpszm.mongodb.net/test?retryWrites=true&w=majority", 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true 
    })
    .then(() => console.log('mongodb connected..'))
    .catch(err => console.log(err));
