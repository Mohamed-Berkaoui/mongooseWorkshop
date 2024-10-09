const express = require("express");

const { connect, Schema, model, Types } = require("mongoose");
require("dotenv").config();

//db schema and model

const prodSchema = new Schema({
  // title:{type:String,required:true,minLength:[3,"name must be longer then 3 words"]}
  title: {
    type: String,
    required: true,
    minLength: 3,
    validate: {
      validator: (value) => value.length > 3,
      message: "name must be longer then 3 words",
    },
  },
  category:{type:String,required:true,enum:["keybord","headphone","screen","mouse"]},
  price:{type:Number,required:true,min:[0,"price must be more then 0"],max:[1000,"price must be less then 1000"]}
},{versionKey:false,timestamps:true});

const productModel=new model('product',prodSchema)

const app = express(); 
app.set("views", "public");
app.set("view engine", "ejs");

function asyncHandler(fn){
    
return async function(req,res,next){
        try {
           await fn(req,res,next)
        } catch (error) {
            res.send('errooooorrrrrrrrrrrrrrrrrrrrrrrr')
        }
}
}

async function getIndexPage (req, res,next) {
    const prods=await productModel.find()
  res.render("index",{prods});
}
app.get("/",asyncHandler(getIndexPage));

app.get("/addproduct", asyncHandler(function (req, res) {
    res.render("addproduct");
  }));

app.post("/addprod",express.urlencoded({extanded:true}), asyncHandler(async function (req, res) {//{name:titke,price:100,category:cat}
    console.log(req.body)
    const newProd= await productModel.create({...req.body,title:req.body.name})
    console.log(req.body)

    res.redirect('/')
}));

connect(process.env.DB_URI, { dbName: "ecommerce" })
  .then(() => {
    app.listen(process.env.PORT, function () {
      console.log("server running on port " + process.env.PORT);
    });
  })
  .catch((e) => {
    console.log(e.message);
  });
