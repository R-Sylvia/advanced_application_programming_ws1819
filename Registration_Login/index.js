
var express = require('express')
var app = express()
var serveStatic = require('serve-static')

const middleswares = require("./middlewares")
const webtoken = require("./webtoken")


middleswares.build(app).start()

const USERS_COLLECTION = 'users'

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/sm'

var database = null
MongoClient.connect(url, function (err, db) {
  if (err) throw err
  console.log('Database created!')
  database = db
    // db.close()
})



app.get("/", function(req, res){
  console.log(req.token)
  if(req.token.isAuthenticated){
    res.send ({ status: 200, data: 'You are authenticated User'})
  }else{
    res.send({status: 400, data: 'You are not authenticated User'})
  }
})
app.post('/login', function (req, res) {
    const body = req.body
    const email = body.email
    const password = body.password
    //const authHeader = req.get("Authorization")
    if(email && password){
        var dbo = database.db('mydb')
        dbo.collection(USERS_COLLECTION).findOne({
            email: email,
            password: password
        }, function(err, result) {
            if (err) throw err;
            if(result) {
                res.send({
                  status: 200,
                  data: webtoken.generate(result)}
                                    )
            }
            else {
                res.send({
                    data: 401
                  })
            }
          });
    }
    else{
        res.send({
            error: 'email and password should be provided'
          })
    }    
  })

app.post('/register', function (req, res) {
  const body = req.body
  const email = body.email
  const password = body.password
  if (email && password) {
    insertUser(
      {
        email,
        password
      },
            user => {
              res.send({
                status: 201,
                user: user
              })
            }
        )
  } else {
    res.send({
      status: 400 
    })
  }
})

app.listen(8000)

function insertUser (user, cb) {
  var dbo = database.db('mydb')
  dbo.collection(USERS_COLLECTION).insertOne(user, function (err, res) {
    if (err) throw err
    cb(user)
  })
}
