const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


const secret = "WTF...ppppppppppppppppppppppppppp"

exports.generate = function(data) {
  var hashedPassword = bcrypt.hashSync(data.password, 8); 
  const token = jwt.sign({ id: data._id }, secret, {
    expiresIn: 86400 // expires in 24 hours
  })
  return token
}


exports.verify = function(token, done=null) {
  //var token = req.headers['x-access-token'];
  
  
  if (!token)
    return done(null) //res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, secret, function(err, decoded) {
    if (err)
    return done(null) //res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    //req.userId = decoded.id;  
    
    return done({
      id: decoded.id
    })
  });
}

