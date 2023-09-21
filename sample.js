const express = require('express');
const app = express();
const path = require('path');
const  hbs = require('hbs');
const mysql = require('mysql');
const doenv = require("dotenv");
const cookieParser = require("cookie-parser");

const route = require('./router/route');
const router = require('./router/auth');

doenv.config({
    path: "./.env",
  });

const connect = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
})

connect.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('connected to mysql')
    }
});
app.use(cookieParser());
app.use(express.urlencoded({ extended :false}));

const locate = path.join(__dirname,'public');
app.use(express.static(locate));
const parse = path.join(__dirname,'main');
hbs.registerPartials(parse);

app.set('view engine','hbs')

app.use('/',route)
app.use('/auth',router)

app.listen(3000,()=>{
    console.log('the server is connected')
})