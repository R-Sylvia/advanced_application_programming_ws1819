
cosnt updatescore = async (userId, score, name) => {
    const user = await User.findOne({username});
    if(score > user.score) {
      user.score = score;
      await user.save();
    }
  }


  //To update some fields
  db.collection.update(
    <query>,
    <update>,
    {
      upsert: <boolean>,
      multi: <boolean>,
      writeConcern: <document>,
      collation: <document>
      arrayFilters: [ <userId>, <score>, <name> ]
    }
 )

