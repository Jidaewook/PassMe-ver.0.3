const mongoose = require('mongoose');

mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('mongodb connected..'))
    .catch(err => console.log(err));
