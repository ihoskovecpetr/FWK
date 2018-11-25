var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var validator = require('validator');
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var path = require("path");
mongoose.Promise = global.Promise;
var _ = require("underscore");

console.log("1!");

var url = 'mongodb+srv://hoskope1:aussie@cluster0-pnp6m.mongodb.net/decaf?retryWrites=true';
mongoose.connect(url, { useNewUrlParser: true });
var Schema = mongoose.Schema;
console.log("2!");
mongoose.set('debug', true);

MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
router.use(bodyParser.json());

///


const Sub_Menu = new mongoose.Schema({

  name_sub: {type: String},
  date_sub: {type: String},
  state_sub: {type: Boolean},
  priradit_sub: {type: Boolean},
  poznamka_sub: {type: String},
});

const POI = new mongoose.Schema({

  name: {type: String},
  lng: {type: Number},
  lat: {type: Number},
  info: {type: String},
  price: {type: Number},
  confirmed: {type: Boolean},
  toBeDeleted: {type: Boolean},
  subinfo: [Sub_Menu]   
});

const coffeeCollection = mongoose.model('Phil', POI)


function Add(name, lng, lat, info, price, confirmed, toBeDeleted) {
console.log("Add P AKCE")

  coffeeCollection.create({ name: name , lng: lng, lat: lat , info: info, price: price, confirmed: confirmed, toBeDeleted: false} )
  .then(doc => {
    console.log("Pridano!!!!");
    res.json({doc: doc});   
  }); 
}


router.use(express.static(path.join(__dirname, 'client/dist')));

// Index get - loading static index.html
router.get('/', function(req, res, next) {
  console.log("__dirname--------------------   ---- ");
  console.log(__dirname);
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});

//Show everything, delete and add - helper func. for development

router.get('/db', function(req, res, next) {
  console.log("ozvalo se api/users");

  coffeeCollection.find({}, function (err, docs) {
    console.log("Inside find");
    console.log(docs);
    res.json({docs: docs}); });
});

router.get('/delete', function(req, res, next) {
  coffeeCollection.deleteMany({ }, function(err, delData){
  console.log("DELETEDDD")})
  res.send('Deleted - hotovo');  
});

router.get('/add', function(req, res, next) {

  Add();
  res.send('Add hotovo XXCC');
});


//Request add point

router.post('/add/points',function(req , res, next){
  console.log('jsme v add/poinst');
  console.log(req.body);
  Add(req.body.name, req.body.lat, req.body.lng, req.body.info, req.body.price);
  res.send('Add hotovo XXCC');
});

//Add custom point from

router.post('/add-custom-point',function(req , res, next){
  console.log('jsme v add-custom-point');
  console.log(req.body);
  Add(req.body.name, req.body.lat, req.body.lng, req.body.info, req.body.price , req.body.confirmed);
  res.send('Add hotovo Custom point');
});


router.post('/acknowleadge-point',function(req , res, next){
    console.log("acknowleadge-point k upraveni _id");
    console.log(req.body._id);
    var id = req.body._id;
    coffeeCollection.findByIdAndUpdate( id , { $set: { confirmed: true}}, function(){console.log("Done Update")} );
});

router.post('/mark-delete-point',function(req , res, next){
    console.log("/mark-delete-point k upraveni _id");
    console.log(req.body._id);
    var id = req.body._id;
    coffeeCollection.findByIdAndUpdate( id , { $set: { toBeDeleted: true}}, function(){console.log("Done Update To Be Deleted")} );
});

router.post('/delete-point',function(req , res, next){
    console.log("delete-point po odsouhlaseni adminem");
    console.log(req.body._id);
    var id = req.body._id;
    coffeeCollection.deleteMany({ _id: req.body._id }, function(err, delData){
    console.log("DELETEDDD" + delData)})
    res.send('Deleted - hotovo'); 
   });


module.exports = router;


