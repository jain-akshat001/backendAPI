const mongoose = require('mongoose');

const url = process.env.DB_STRING

mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true  
})

mongoose.connection.on('connected', (err) => {
    if(err) {
        console.log('there is an error ', err);
    }
    console.log('Database connected successfully');
})