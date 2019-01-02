
/**
 * server side game logic
 */

module.exports = class GameBase {

    constructor(maxplay){
        // maximum number of players
        this.maxPlayers = maxplay
        // array to store players
        this.avatars = new Array(this.maxPlayers)
        // array to store scores
        this.scores = new Array(this.maxPlayers)
        // array to store objects to grab
        this.itemsToGrab = new Array(100)
    }

    initialise() {
        // current player count
        this.numPlayers = 0;

        // initialise array itemsToGrab

    }

    addPlayer() {
        if (this.numPlayers < this.maxPlayers) {
            // add player
            this.numPlayers += 1
            this.avatars[this.numPlayers - 1] = this.numPlayers //placeholder for: new THREE.Object3D();
            this.scores[this.numPlayers - 1] = 0
            return this.numPlayers - 1  // new player's id
        } else {
            // no new player can be added
            return false
        }
    }

    // no safety check yet
    removePlayer(id){
        this.numPlayers -= 1;
        this.avatars[id] = null;
    }

    updatePlayerPosition(player, position) {    // position is a placeholder
        if (player < this.numPlayers) {
            // update player's position

            // update scores and itemarray
            return true
        } else {
            // player does not exist
            return false
        }
    }

    getPlayers() {
        return this.avatars;
    }

    getScores() {
        return this.scores;
    }

    getItems() {
        return this.itemsToGrab;
    }



// typedefinition player (e.g. struct with position and score and name?)

    /**
     * variable.
     * list of objects in the gamefield, send to all clients via websocket so they can display the game
     */
// object list

    /**
     * function that checks if any player has hit an object and reacts on that (e.g. delete something from the object list, update points
     */
// function collisionDetection()...

}