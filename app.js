require('dotenv').config();
console.log(process.env.SECRET);
console.log(process.env.API_KEY);

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");


const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/secretDB");
const userSchema= new mongoose.Schema({
    email:String,
    password:String
});
userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]})
const User=new mongoose.model("User", userSchema)

app.get('/', function(req, res){
    res.render('home')
})
app.get('/login', function(req, res){
    res.render('login')
})
app.get('/register', function(req, res){
    res.render('register')
})
app.post("/register", function(req, res){
const emails=req.body.username;
const passwords=req.body.password;
const newUser=new User({
    email:emails,
    password:passwords
})

newUser.save(function(err){
if(err){
    res.send(err)
}else{
    res.render("secrets")
}
})
});
 app.post("/login", function(req, res){
    const email2=req.body.username;
    const password2=req.body.password;
    User.findOne({email:email2}, function(err, results){
if(err){
    res.send(err)
}else{
    if(results){
if(results.password===password2){
    res.render("secrets")
}else{
    res.send("email not found")
}
    }
}
    })
 })
app.listen(3000, function(req, res){
    console.log("server is listening to port 3000")
})