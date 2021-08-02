const path = require('path');
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require('cors');
require('./mongoose')

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const post = require("./models/post");

const app = express();
app.use(cors());
//const abc= require('./example')

app.use(bodyParser.json());
app.use('/images',express.static(path.join(__dirname,'images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);


  app.listen(process.env.PORT || 8080,(req,res)=>{
    console.log("succesfully run in 8080"),
    console.log(process.env.PORT)


  })
  app.get('/',(req,res)=>{res.send('It is runnung')})
  app.post('/me',async (req,res)=> {

    const posts = new post(req.body);
     await posts.save().then((post)=>{
    console.log(post)
    res.send("succesfully");
  }).catch((e)=>{console.log(e)})

    console.log(res.status())
  })

  app.get('/me/:id',async(req,res)=>{
    const _id = req.params.id
    const selected = await post.findById(_id)
    const posts = await post.find({title:'IN THIS MODERN ERA, BRIJESH IS KING'})
    //zres.setHeader("Access-Control-Allow-Origin", "*");
    res.send(selected)
  })

  app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode || 500; //if undefine it will take 500
    const message = error.message; // this property exist by default\
    const data = error.data;
    res.status(status).json({message: message , data:data});
  });