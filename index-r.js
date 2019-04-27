var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var validator = require('validator');
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var path = require("path");
mongoose.Promise = global.Promise;
var serveIndex = require('serve-index');
var _ = require("underscore");
var multer  = require('multer');
var fs = require('fs');
var request = require('request');
//var Z = require('./z');

console.log("1!");


var url = 'mongodb+srv://hoskope1:aussie@cluster0-pnp6m.mongodb.net/decaf?retryWrites=true';
mongoose.connect(url, { useNewUrlParser: true });
var Schema = mongoose.Schema;
console.log("2!");
mongoose.set('debug', true);

MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  console.log("Database connect!");
  db.close();
});


router.use(express.static(path.join(__dirname, 'client/dist')));

app.use('/.well-known', express.static('.well-known'), serveIndex('.well-known'));
app.use('/img', express.static('img'), serveIndex('img'));

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
router.use(bodyParser.json());


///



const POI = new mongoose.Schema({

  name: {type: String},
  lng: {type: Number},
  lat: {type: Number},
  info: {type: Array},
  price: {type: Number},
  categorie: {type: String},
  venueId: {type: String},
  confirmed: {type: Boolean},
  toBeDeleted: {type: Boolean}, 
  pathToImage: {type: String},
  photos: {type: String}, 
  brand: {type: String},
  geometry: {
      type: {
      type: String,
      default: "Point"
    },
    coordinates: {
      type: [Number]
    }
    }
 // geojson: [GeoJson]
});


POI.index({ geometry: "2dsphere" });

const coffeeCollection = mongoose.model('Phil', POI)


function Add(name, lng, lat, info, price, categorie, venueId, confirmed, toBeDeleted, photos, brand) {
console.log("Add P AKCE")
console.log(photos)

  coffeeCollection.create({"geometry.coordinates": [lng, lat], name: name , lng: lng, lat: lat , info: info, price: price, categorie: categorie, venueId: venueId, confirmed: confirmed, toBeDeleted: false, photos: photos, brand: brand} )
  .then(doc => {
    console.log("Pridano!!!! ted");
    res.json({doc: doc});   
  }); 
}


//Setting storage engine
const storage = multer.diskStorage({
  destination: './w-client/src/uploads',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000},
  /* fileFilter: function(req, file, cb){
    //checkFileType(file, cb)
  }  */
}).single('myImage');


//Upload from form from InfoWndow
router.post('/uploads', function(req, res, next) {
  console.log("ozvalo se localhost:3000/uploads  POST v index-r.js");
  upload(req, res, (err) => {
    if(err){
      res.send('Je tam error' + err)
    } else{
      console.log(req.file)
      res.send("Poslano v index-r.js")
    }
  })
});



// Index get - loading static index.html
router.get('/', function(req, res, next) {
  console.log("__dirname--------------------   ---- ");
  console.log("__dirname--------------------   ---- ");
  console.log("__dirname--------------------   ---- ");
  console.log(__dirname);
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});


// Agregate results and deleting duplicities
router.get('/agro', function(req, res, next) {
  console.log("ozvalo se /agregace");

var agrColl = coffeeCollection.aggregate([
                     { $match: { 
                          venueId: { "$ne": '' }  
                        }},
                     { $group: { _id: "$venueId", count: { $sum: 1 }, dups: { "$addToSet": "$_id" } } },
                     { $match: { 
                          count: { "$gt": 1 }    // Duplicates considered as count greater than one
                         }}
                   ], function(err, docs){
res.json({docs: docs});

for (var key in docs){
  console.log("++++++++++++++++ Key: " +key+" value: " +docs[key].dups)
   docs[key].dups.shift();      // First element skipped for deleting
console.log("Arr bez prvniho -- " + docs[key].dups) 

_.map(docs[key].dups, (id, index) =>{
  console.log("Deletuju -- " + id)
   coffeeCollection.deleteMany({ _id: id }, function(err, delData){
    console.log("DELETEDDD" + delData)})
      })
    } 
  }
)


});

router.get('/delete-shell',function(req , res, next){
    console.log("delete-point po odsouhlaseni adminem");
    coffeeCollection.deleteMany({ name: "Shell / Coles Express" }, function(err, delData){
    console.log("DELETEDDD" + " Shell / Coles Express" + delData)})
    res.send('Deleted - hotovo' + res); 
   });


//delete some if contains "substring"
router.get('/delete-some',function(req , res, next){
    console.log("delete-point po odsouhlaseni adminem");
    coffeeCollection.deleteMany({price : 2}, function(err, delData){  //{name: {$regex: "BWS"}}
      console.log(delData)
    console.log("DELETEDDD" + " Shell / Coles Express" + delData)})
    res.send('Deleted - hotovo'); 
    res.json(delData)
   });


//Request add point

router.post('/api/near-fetch',function(req , res, next){
  console.log('jsme v /api/near-fetch');
  console.log(req.body.workingLocationGate);

coffeeCollection.find(
   {geometry: {
      $nearSphere: {
          $geometry: {
              type : "Point",
              coordinates : [ req.body.workingLocationGate[1] , req.body.workingLocationGate[0] ]
                },
          // $maxDistance: 900000,
          } 
      }
    }
, function(err, docs){
  console.log("err")
  console.log(err)
  console.log("docs")
  console.log(docs)
res.json({docs: docs});
  }
).limit( 40 )
});


router.post('/api/boundaries',function(req , res, next){
  console.log('fetch BoundariesFORMA');
  console.log("req.body.sw")
  console.log(req.body.sw1, req.body.sw2)
  console.log(req.body.ne1, req.body.sw2)
  console.log(req.body.ne1, req.body.ne2)
  console.log(req.body.sw1, req.body.ne2)
  console.log(req.body.sw1, req.body.sw2)
  console.log("FORMA - [ 149 ,-35.2 ], [ 149, -36 ], [ 149.5, -36 ], [ 149.5, -35.2 ], [ 149 ,-35.2 ]")

coffeeCollection.find(
   {geometry: {

       $geoWithin: {
          $geometry: {
             type : "Polygon" ,
             coordinates: [[[ req.body.sw1, req.body.sw2 ], 
                    [ req.body.ne1, req.body.sw2 ], 
                    [req.body.ne1, req.body.ne2], 
                    [ req.body.sw1, req.body.ne2], 
                    [ req.body.sw1, req.body.sw2 ]]]
          }
       }


      // $nearSphere: {
      //     $geometry: {
      //         type : "Point",
      //         coordinates : [ req.body.workingLocationGate[1] , req.body.workingLocationGate[0] ]
      //           },
      //     // $maxDistance: 900000,
      //     } 
      }
    }
, function(err, docs){
  console.log("err")
  console.log(err)
  console.log("docs")
  console.log(docs)
res.json({docs: docs});
  }
)//.limit( 100 )
});

// Go thru all and add geometry object

router.get('/add-geo', function(req, res, next) {
  console.log("ozvalo se /add-geo");

var data;

coffeeCollection.updateMany(
  { geometry: { $exists: false }},
  { $set: { "geometry.coordinates": [23, 41] }}, function(err, data){
    res.json({data: data})
    console.log("ADIOS Hotovo" + data)}
)

 

});

//DB 2
router.get('/db2', function(req, res, next) {
  console.log("ozvalo se api/db2 ");

  const cursor = coffeeCollection.find({ price: 1 }).cursor();
  cursor.on('data', function(doc){
    console.log(doc.name)
    console.log("-------")
    console.log(doc.venueId)
    console.log("------- 1")
  });

});

//Find VenueId

router.get('/dbVenueId', function(req, res, next) {
  console.log("ozvalo se api/dbVenueId");

  coffeeCollection.find({ price: 1 }, function (err, docs) {
    console.log("Inside find");
    console.log(docs);
    res.json({docs: docs}); }).then( data => {res.send(data)}
    
    )
});



// Vote get
router.get('/voteColes', function(req, res, next) {
  console.log(" vote gettting counts Coles");
    coffeeCollection.find({ name: "ColesVote" }, function (err, docs) {
    console.log("Inside find");
    console.log(docs);
    res.json({docs: docs}); }).then( data => {res.send(data)}
    
    )
});

// Vote get Seven Eleven
router.get('/voteSeven', function(req, res, next) {
  console.log(" vote gettting counts  Seven-11");
    coffeeCollection.find({ name: "SevenVote" }, function (err, docs) {
    console.log("Inside find");
    console.log(docs);
    res.json({docs: docs}); }).then( data => {res.send(data)}
    
    )
});


router.get('/voteColesAdd', function(req, res, next) {
  console.log(" vote COLES ++ ");
coffeeCollection.update( {_id:'5c48172e397792024c88bb30'} , { $inc: { price: 1 }}, function(res){console.log("Done Update Coles")} );
      
});

router.get('/voteSevenAdd', function(req, res, next) {
  console.log(" vote Seven ++ ");
coffeeCollection.update( {_id:'5c48167e397792024c88bb2f'} , { $inc: { price: 1 }}, function(res){console.log("Done Update Seven-11")} );
      
});

//Show everything, delete and add - helper func. for development

router.get('/db', function(req, res, next) {
  console.log("ozvalo se api/users");

  coffeeCollection.find({}, function (err, docs) {
    console.log("Inside find");
    console.log(docs);
    res.json({docs: docs}); }).stream()
  .on('data', function(doc){
    console.log(doc)
    console.log("Iterace" )
  })
});

router.get('/delete', function(req, res, next) {
  coffeeCollection.deleteMany({}, function(err, delData){
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
  console.log(req.body.venueId);

  var adresa = 'uploads/'+req.body.venueId+'.png';
   console.log("adresa")
   console.log(adresa)
   var url = 'neni foto'

   if (req.body.photos == 0) {
        console.log('UPLOAD neni co uploadovat');
   } else{
        download(req.body.photos, 'public/img/'+req.body.venueId+'.png', function(err, data){
  console.log('done UPLOAD');
  });
  url = 'https://www.flatwhiteking.club/img/'+req.body.venueId+'.png';
   }

  Add(req.body.name, req.body.lat, req.body.lng, req.body.info, req.body.price, req.body.categorie, req.body.venueId, true, false, url, req.body.brand);
  res.send('Add hotovo XXCC');
});

//Add custom point from

router.post('/add-custom-point',function(req , res, next){
  console.log('jsme v add-custom-point');
  console.log(req.body);
  Add(req.body.name, req.body.lat, req.body.lng, req.body.info, req.body.price , "Undefined Yet", req.body.venueId , req.body.confirmed, false);
  res.send('Add hotovo Custom point');
});


router.post('/acknowleadge-point',function(req , res, next){
    console.log("acknowleadge-point k upraveni _id");
    console.log(req.body._id);
    var id = req.body._id;
    coffeeCollection.findByIdAndUpdate( id , { $set: { confirmed: true}}, function(){console.log("Done Update")} );
    res.send('acknowleadge-point hotovo');
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


//Add from array
// router.get('/coles-express',function(req , res, next){
//   console.log('coles Express');
// var jedna; 
// var dva; 
// var tri;

//   _.map(Z, (one, index) => {

// if (((index + 1)%3) == 0) { tri = one; 
//   console.log(" Cela trojka dohromady" + jedna + " - " + dva + " - " + tri)
//   Add( "Coles Express ", dva , jedna , [{address: tri }] , 0.8 , "Coles Express Array" , '' , true, false)
// }

// if (((index + 1)%3) == 1) { jedna = one}
//   if (((index + 1)%3) == 2) { dva = one}
// }

//   )
//    res.send('projeto Coles');
// });


var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
   // console.log('content-type:', res.headers['content-type']);
   // console.log('content-length:', res.headers['content-length']);
   console.log('error:', err);
    request(uri).on('error', function(e){console.log("Error jak prase Hoskovecc", e)}).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};



//Delete Coles Array pints
router.get('/delete-coles',function(req , res, next){
    // console.log("delete-point po odsouhlaseni adminem");
    // console.log(req.body._id);
    // var id = req.body._id;
    // coffeeCollection.deleteMany({ categorie: "Coles Express Array" }, function(err, delData){
    // console.log("DELETEDDD Coles" + delData)})
    // res.send('Deleted - hotovo'); 
   });

//Delete Coles Array pints
router.get('/delete-coles-all',function(req , res, next){
    // console.log("delete-point po odsouhlaseni adminem");
    // console.log(req.body._id);
    // var id = req.body._id;
    // coffeeCollection.deleteMany({ price: 0.8 }, function(err, delData){
    // console.log("DELETEDDD Coles" + delData)})
    // res.send('Deleted - hotovo any Coles gone'); 
   });



// Index get - loading static index.html
router.get('/*', function(req, res, next) {
  console.log("Catched, redirected to home '/' ");
   return res.redirect('/');
   next();
});



module.exports = router;


