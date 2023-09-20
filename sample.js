const express = require('express');
const app = express();
const path = require('path');
const  hbs = require('hbs');
const mysql = require('mysql');
const route = require('./router/route');
const router = require('./router/auth');


const connect = mysql.createConnection({
host:'localhost',
user: 'root',
password:'',
database:'test'
})

connect.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('connected to mysql')
    }
});

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