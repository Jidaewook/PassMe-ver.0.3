const mongoose = require('mongoose');

mongoose.connect(process.env.DB, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true 
    })
    .then(() => console.log('mongodb connected..'))
    .catch(err => console.log(err));
