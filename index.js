const express = require('express');
const path = require('path');
const passport = require('passport');
var app = express();

require('dotenv').config();

require('./config/database');

const User = require('./model/user');

require('./config/passport')(passport);

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(require('./routes'));

app.listen(3000);