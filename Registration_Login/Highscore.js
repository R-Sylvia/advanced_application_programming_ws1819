
var localStorageName = "jumpjumpjump";
var highScore;

//the conditional operator as an if statement
if(localStorage.getItem(localStorageName) == null) {
    highScore = 0;
} else {
    highScore = localStorage.getItem(localStorageName);
}

//this is how we retrieve previously saved high score
//To save it, we’ll need to add a couple of lines to create method in GameOver state
// You must place these couple of lines on the part (page) which you want to show the scores, the highscore and game over at the end of the game 
function highscore(){
    highScore = Math.max(score, highScore);
    localStorage.setItem(localStorageName, highScore);
}

//To save the score
scores : [{
    user: {
      type: ObjectID,
      ref: 'user',
    },
    score: Number,
  }]

  //Aggregation framework: For getting the ID, Score, User name and after that sort the score
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
         

          