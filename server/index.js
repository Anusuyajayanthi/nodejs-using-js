
var express = require('express');
var index = express();
index.use(express.static('client'));
var path = require('path');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myDb',{ useNewUrlParser: true });
index.use(bodyParser.json())


var db = mongoose.connection;
 
db.on('error', function (err) {
  console.log('connection error', err);
});

db.once('open', function () {
  console.log('connected.');
});

var Schema = mongoose.Schema;
var userSchema = new Schema({
  username : String,
  email : String,
  password : String,
  cPassword : String,
  
});
var userSchema1 = new Schema({
productid : Number,
  productname : String,
  ownername : String,
  ownerid : String,
  producturl : String
});
    
var employees = mongoose.model('employees', userSchema);
index.get('/register', function(req, res) {
   res.sendFile(path.join(__dirname, '/client/register.html'));
});
 
index.get('/home', function(req, res) {
   res.sendFile(path.join(__dirname, '/client/home.html'));
});
  
index.get('/userreq', function(req, res) {
   res.sendFile(path.join(__dirname, './assets/scripts/userreq.js'));
});
  
index.get('/login', function(req, res) {
   res.sendFile(path.join(__dirname, '/client/login.html'));
});

index.get('/product', function(req, res) {
   res.sendFile(path.join(__dirname, '/client/product.html'));
});

index.get('/editproduct', function(req, res) {
   res.sendFile(path.join(__dirname, '/client/editproduct.html'));
});
//register
  
  index.post('/userRegister', function(req, res) {
    console.log(req.body);
    console.log(req.body.username);  
    var user = new employees({
      username : req.body.username,
      email : req.body.email,
      password : req.body.password,
      cPassword : req.body.cPassword
  });
  res.send(user.save(function (err, storeData, unauthorized) {
    if (err) console.log(err);
    else if(unauthorized)console.log('not authorize person');
    else 
    console.log('Saved : ', storeData );
  }));
});

//login

index.post('/login', function (req, res) {
  var findvalue = employees.findOne({
    email : req.body.email,
    password : req.body.password
 });
  findvalue.exec(function (err,unauthorized) {
    if (err)
      console.log("data not found");
    else if(unauthorized)
    {
      console.log(unauthorized);
      return res.status(200).json(unauthorized);
    }
    else {
      console.log('not authorize person');
      return res.status(401).end;
      }
  });
});
 
//product insert
  
  var product = mongoose.model('product', userSchema1);
  index.post('/product', function(req, res) {
    var user = new product({
    productid : req.body.productid,
    productname : req.body.productname,
    ownername : req.body.ownername,
    ownerid : req.body.ownerid,
    producturl : req.body.producturl
  });
  console.log(req.body.productname);
  res.send(user.save(function (err, product, unauthorized) 
  {
    if (err) console.log(err);
    else if(unauthorized)console.log('not authorize person');
  }));
});

//show product

index.post('/product_show', function (req, res) {
  var get_product = product.find({ 
     ownerid : req.body.ownerid 
  });
 
  get_product.exec(function (err,storedata) {
    if (err)
       console.log("data not found");
      else if(storedata)
      {

        // console.log(storedata);
        return res.status(200).json(storedata);
       
        
      }
     else {
        console.log('not authorize person');
        return res.status(401).end;
      }
      
  });
});


//edit product
index.post('/find_product', function (req, res) {
  console.log("...............data.........");
  console.log(req.body.id);
  var upvalue = product .find({
      _id: req.body.id,

});
upvalue.exec(function (err,finddata) {
  if (err)
  {
    console.log("data not found");
  }
    
    else 
    {    console.log("The values of update",finddata);
      return res.status(200).json(finddata);
  

    }
    });
});

index.post('/update_product', function (req, res) {
  console.log("...............data.........");
  console.log(req.body.id);
 product .updateOne({
      _id: req.body.id
  },{ $set :{
      "productname" : req.body.productname,
			"producturl" : req.body.producturl}},(err,object)=>{
        if (err) {
          res.status(400).send('msg:Server Error');
      }
      else {
          res.status(200).send('msg: Data update in database');
      }
      }
 );
    });
  




//Delete Product

index.post('/deleteproduct/', function (req, res) {
  var upvalue = product .find({
      id: req.body._id,
});
console.log('id:',req.body._id);
product.deleteOne({ _id: req.body.id }, function (data,err) {
        if (data) {
          return res.status(200).json(data);
        } else {
            console.log(err);
            return res.send(404, { error: "Person was not deleted." });
        }
  });

});

var server = index.listen(5000, function () {
    console.log('Node server is running..');
});





  
   