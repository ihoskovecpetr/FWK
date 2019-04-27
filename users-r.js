var express = require('express');
var router = express.Router();
var validator = require('validator');
var bodyParser = require('body-parser');

// parse application/json
router.use(bodyParser.json());

///

function validateInput(data) {
	let errors = {};

	if (validator.isEmpty(data.username)) {
		errors.username = 'This is required'
	}
	if (validator.isEmpty(data.password)) {
		errors.password = 'This is required'
	}
	if (data.password !== 'heslo') {
		errors.login = 'Heslo does not match to Username'
	}
	if (data.username !== 'Petr') {
		errors.login = 'Heslo does not match to Username'
	}

	return {
		errors,
	}
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log("ozvalo se localhost:3000/users/");
  res.send('respond with a resource USERS');
});


router.post('/login',function(req , res, next){
	  console.log("ozvalo se users/login");
	setTimeout(() => {
  console.log(req.body);

  const { errors } = validateInput(req.body)

  if (isEmpty(errors)) {
  	console.log('zadny error');
  	res.json({ success: true })
  } else {console.log(' je tam error');
  	res.status(400).json(errors);
  }

  console.log(errors)
  }, 500 );
});

module.exports = router;
