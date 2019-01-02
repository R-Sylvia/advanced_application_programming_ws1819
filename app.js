let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let FileStore = require('session-file-store')(session);

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();


//Database (Damoon)
const middleswares = require("./bin/database_middleware")
const webtoken = require("./bin/database_webtoken")
middleswares.build(app).start()
const USERS_COLLECTION = 'users'
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/sm'
//const url = 'localhost:8080';
var database = null
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err
    console.log('Database created!')
    database = db
    // db.close()
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);





app.use(session({
    name: 'session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    saveUninitialized: true,
    resave: true,
    store: new FileStore(),
    cookie: {
        httpOnly: false,
        ephemeral: true,
    }
}));



/*
app.get('/', function(req, res){
    console.log('test');
});
*/

/*
app.get('/', (req, res) => {
    console.log('test');
    res.send('An alligator appears!');
});
*/

/*
app.get('/', (req, res) => {
    res.send('you just hit the home page\n');
    console.log('here');
})

app.get('/', (req, res, next) => {
    // req.session
    req.session.user = 'arschloch';
    console.log('arschloch set');
    res.user = req.session.user;
});

app.use('/', (req, res, next) => {
    // req.session
    req.session.user = 'arschloch';
    console.log('arschloch set');
    res.user = req.session.user;
});


app.use(function(req, res, next) {
    req.session.user = 'arschloch';
    console.log('ser arschloch');
});
*/


app.get("/username", function(req, res){
    console.log("try get username")
    console.log("cookie max age: " + req.session.cookie.maxAge)
    if (req.session.user === undefined) {
        concole.log("no username")
        res.send({status: 400, data: 'no username'})
    } else {
        if (req.session.user === null) {
            res.send({status: 400, data: 'no username'})
        } else {
            console.log("username found: " + req.session.user)
            res.send({status: 200, data: req.session.user})
        }
    }
})

app.post("/logout", function(req, res){
    if (req.session.user) {
        req.session.user = null
    }
    res.send({status: 200})
})

// checks if user is authenticated
app.get("/", function(req, res){
    //console.log(req.token)
    if(req.token.isAuthenticated){
        console.log('authenticated')
        res.send ({ status: 200, data: 'You are authenticated User'})
    }else{
        res.send({status: 400, data: 'You are not authenticated User'})
        console.log('not authenticated')
    }
})

// login function
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
                req.session.cookie.maxAge = 360000000000
                req.session.user = email
                res.send({
                    status: 200,
                    data: webtoken.generate(result)}
                )
            }
            else {
                req.session.cookie.user = null
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

// TODO check if username is already chosen
// register function
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


app.get("/menu", function(req, res){
    console.log("call ended here")
    res.sendFile(__dirname + '/public/menu.html')
})

app.post("/startPlaying", function(req, res) {

})

app.post("/updatePosition", function(req, res) {
    // update position

    // send new positions to all players (playerarray

    // send items to all players
})


// helper function
function insertUser (user, cb) {
    var dbo = database.db('mydb')
    dbo.collection(USERS_COLLECTION).insertOne(user, function (err, res) {
        if (err) throw err
        cb(user)
    })
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log('error occured');
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;