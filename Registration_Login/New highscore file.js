

var localStorage = "game";
var highScore;
//the conditional operator as an if statement
//getItem method of localStorage retrieves localStorageName data. If it’s null, it means we never saved a high score.
app.get("/localStorage", function(req, res) {
     if(localStorage.getItem(localStorageName) == null) {
    highScore = 0;
} else {
    highScore = localStorage.getItem(localStorageName);
}})

//this is how we retrieve previously saved high score
//To save it, we’ll need to add a couple of lines to create method in GameOver state
function highScore(){
    highScore = Math.max(score, highScore);
    localStorage.setItem(localStorageName, highScore);
    var text = game.add.text(
        game.width / 2, game.height / 2, "Game Over\n\nYour score: " + score + "\nBest score: " + highScore + "\n\nTap to restart", style
    );
    
    text.anchor.set(0.5);
    game.input.onDown.add(this.restartGame, this);
}

//To save the score

app.post("/scores", function(req, res) {
    scores : [{
        user: {
          type: ObjectID,
          ref: 'user',
        },
        score: Number,
    }]
})

//Aggregation framework: For getting the ID, Score, User name and after that sort the score
function aggregate() {
    var db = database.db('mydb')
db.collection.aggregate([
      {$group: {
          _id: "$userId",
           score: {$max: "$score"},
            name: {$first: "$name"}}},
            {$sort: {score: -1}}],
            function( err, results ) {
                if ( !err ) {
                   
                  result.forEach( result => {
                    // process items in results here, setting a value
                    // using the actual logic for writing message ...
                    if( score )
                      result.message = "your score is";
                    else
                      result.messsge = 'OK';
                  });
                  }
                callback(err, results);
            });
        }

        app.get("/userId", function(req, res){
            console.log("try get userID,score,name")
            if (req.session.user === undefined) {
                concole.log("no userId")
                res.send({status: 400, data: 'no userId'})
            } else {
                if (req.session.user === null) {
                    res.send({status: 400, data: 'no userId'})
                } else {
                    console.log("userId found: " + req.session.user)
                    res.send({status: 200, data: req.session.user})
                }
            }
        })

//To update these parameters in mongoDB

function update (userId,name,score) {
    var db = database.db('mydb')
    db.collection.update(
        "query",
        "update",
        {
          upsert: "boolean",
          multi: "boolean",
          writeConcern: "document",
          collation: "document",
          arrayFilters: [ userId, score, name ]
        }
    ) 
}

app.put('/highscore', function (req, res) {
    const userId = req.userId
    const name = userId.name
    const score = body.score
    if (name && score) {
        update(
            {
                name,
                score
            },
            user => {
                res.send({
                    status: 200,
                    user: score  
                })
            }
        )
    } else {
        res.send({
            user: 'not update yet'
        })
    }
})
 