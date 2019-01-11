/**
 * In this file a class for the server side game part is defined.
 *
 * @date 25.11.2018
 * @author Nicola Giaconi
 * @author Sylvia Reißmann
 */

let THREE = require('../public/javascripts/three.min') // "include" three.min.js

/**
 * Class to handle the game on server side.
 * Each player gets an index assigned.
 * @author Sylvia
 * @type {module.GameBase}
 */
module.exports = class GameBase {

    /**
     * Constructor of class GameBase.
     * Initialises parameters that will not change.
     * @author Sylvia
     */
    constructor(){
        // maximum number of players
        this.maxPlayers = 5
        // array to store players
        this.avatars = new Array(this.maxPlayers)
        // array to store scores
        this.scores = new Array(this.maxPlayers)
        // array to store objects to grab
        this.server = {	array0 : new Array(100),
						array1 : new Array(100),
						array2 : new Array(100),
						array3 : new Array(100),
						array4 : new Array(100) }

        this.scaleFactor = 1/5;   //change size of all objects but keep proportions
        this.myAvatar = {
            height	   : 70*this.scaleFactor,
            headRadius : 10*this.scaleFactor,
            bodyWidth  : 15*this.scaleFactor
        };
        this.myWorld = {
            edge1 : 1000,
            edge2 : 1000
        };
        this.gameRunning = false
    }

    /**
     * Initialises parameters for a new game.
     * @author Sylvia
     */
    initialise() {
        // current player count
        this.numPlayers = 0;
        for(let i = 0; i < this.maxPlayers; i++) {
        	this.avatars[i] = new Array(2)
			this.avatars[i][0] = null
			this.avatars[i][1] = null
		}

        // initialise arrays for items to grab
        this.createItems()
        this.gameRunning = true
    }

    /**
     * Adds a new player to the current game if possible.
     * @author Sylvia
     * @param name - name of the player to be added.
     * @returns false, if the player can not be added to the game, else players index.
     */
    addPlayer(name) {
        if (this.numPlayers < this.maxPlayers) {
            // add player
            this.numPlayers += 1
			let id = -1
			for (let i = 0; i < this.maxPlayers; i++) {
				if ((this.avatars[i][0] === null) && (this.avatars[i][1] === null) && (id < 0)){
					id = i;
				}
			}
			if (id < 0) {
				return false
			}
            this.avatars[id][0] = 0
			this.avatars[id][1] = 0
            this.scores[id] = { name: name,
                                score: 0}
            return id  // new player's id
        } else {
            // no new player can be added
            return false
        }
    }

    /**
     * Removes the given player from the current game.
     * @author Sylvia
     * @param id - index of the player to be removed.
     * @returns true, if the game finished because the last player left.
     */
    removePlayer(id){
        if (id < this.maxPlayers) {
            this.numPlayers -= 1;
            this.avatars[id][0] = null;
            this.avatars[id][1] = null;
            this.scores[id] = null
            if (this.numPlayers <= 0) { // gamefinished here
                this.gameRunning = false
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    /**
     * Updates the position of the given player.
     * @author Sylvia
     * @param player - index of player with new position.
     * @param position - new position of teh player.
     * @returns false, if the players index is unvalid, else true.
     */
    updatePlayerPosition(player, position) {    // position is a placeholder
    	console.log('position logic: ' + position)
        if (player < this.maxPlayers) {
            // update player's position
			//this.avatars[player] = position
			this.avatars[player] = position
			console.log('in array: ' + this.avatars[player])
            // update scores and itemarray
            return true
        } else {
            // player does not exist
            return false
        }
    }

    /**
     * Returns the players positions.
     * @author Sylvia
     * @returns array with positions of players.
     */
    getPlayers() {
        return this.avatars;
    }

    /**
     * Returns the scores array (score and name per player index).
     * @author Sylvia
     * @returns array with scores of players.
     */
    getScores() {
        return this.scores;
    }

    /**
     * Returns an array with elements of playernames and scores beginning with highes score.
     * @author Sylvia
     * @returns array with scores of current players.
     */
    getScoresSorted() {
        return this.scores.filter(e => e !== null).sort((e1, e2) => e2.score - e1.score)
    }

    /**
     * Returns the struct of arrays containing all information needed to build the items on client siede.
     * @author Sylvia
     * @returns struct with arrays of information.
     */
    getItems() {
        return this.server;
    }

    /**
     * Returns the score of a specific player.
     * @author Sylvia
     * @returns score of player with given index.
     */
    getPlayerScore(id) {
        return this.scores[id].score;
    }

    /**
     * Returns information if a game is currently running.
     * @author Sylvia
     * @returns true, if game is runnign, else false.
     */
    getGameRunning() {
        return this.gameRunning;
    }


////////////////////////////////////////////////////
///////////////  SERVER GAME LOGIC    //////////////
////////////////////////////////////////////////////

    createItems(){
        /*
        Author: Nicola Giaconi
        Description:
            This function creates the items that populate the field
        @return:
            void
        */
        "use strict";
        //server.array0[i] stores geometry type
        //server.array1[i] stores radius of item
        //server.array2[i] stores x-coordinate
        //server.array3[i] stores y-coordinate
        //server.array4[i] stores z-coordinate
        for (let i=0;i<this.server.array0.length;++i){
            let radius = this.myAvatar.headRadius*(1+2*Math.random()-0.5)+this.myAvatar.bodyWidth*3/2;
            let geometry = this.randomGeometry();
            let offset = 0;
            if(geometry.type === "SphereGeometry"){
                offset = geometry.parameters.radius;
                this.server.array0[i] = 0;
                this.server.array1[i] = offset;
            }
            if(geometry.type === "BoxGeometry"){
                offset = geometry.parameters.height/2;
                this.server.array0[i] = 1;
                this.server.array1[i] = offset*2;
            }
            if(geometry.type === "CylinderGeometry"){
                offset = geometry.parameters.height/2;
                this.server.array0[i] = 2;
                this.server.array1[i] = offset*2;
            }
            this.server.array3[i] = offset+0.01;
            this.server.array2[i] = this.myWorld.edge1  * 9/10 * (Math.random()-0.5);
            this.server.array4[i] = this.myWorld.edge2  * 9/10 * (Math.random()-0.5);
        }
    }

    randomColor(){
        /*
        Author: Nicola Giaconi
        Description:
            This function selects a random color
        @return: THREE.Color
            Random color
        */
        "use strict";
        const color = new THREE.Color(Math.random(), Math.random(), Math.random());
        return color;
    }

    randomGeometry(){
        /*
        Author: Nicola Giaconi
        This function selects a random geometrical object among a few predefined options
        @return: Three.Geometry
            Geometry of the random object
        */
        "use strict";
        const selectGeo = Math.random();
        if(selectGeo < 1/3){
            return new THREE.SphereGeometry(this.randomSize(), 10, 10);
        }
        else if(selectGeo < 2/3){
            let size = this.randomSize();
            return new THREE.CylinderGeometry(size, size, size, 16);
        }
        else{
            let size = this.randomSize();
            return new THREE.BoxGeometry(size, size, size);
        }
    }

    randomSize(){
        /*
        Author: Nicola Giaconi
            This function selects a random size within a range
        @return: Number
            Number denoting random size
        */
        "use strict";
        return this.myAvatar.headRadius*(1+2*Math.random()-0.5)+this.myAvatar.bodyWidth*3/2;
    }

    detectCollision(j){
        /*
        Author: Nicola Giaconi, Sylvia Reißmann
        Description:
            This function detects the contact between the avatars and the items
        @input j: number
            player number
        @return:
            void
        */
        //server.array0[i] stores geometry type
        //server.array1[i] stores radius of item
        //server.array2[i] stores x-coordinate
        //server.array3[i] stores y-coordinate
        //server.array4[i] stores z-coordinate
        "use strict";
        let deleted = [];    // array to store indexes to be removed
        let indexcounter = 0;
        for (let i=0;i<this.server.array0.length;++i){
            let dist;
            let distance2D = Math.sqrt(Math.pow(this.avatars[j][0]-this.server.array2[i],2)+
                Math.pow(this.avatars[j][1]-this.server.array4[i],2));
            if(this.server.array0[i] === 0){
                dist = this.server.array1[i];
            }
            else if(this.server.array0[i] === 1){
                dist = this.server.array1[i]*1.2;
            }
            else if(this.server.array0[i] === 2){
                dist = this.server.array1[i];
            }
            else{
                dist = 0;
            }
            if(distance2D <= dist){
                let indexItemToRemove = i;
                deleted[indexcounter] = indexItemToRemove;
                indexcounter++;
                console.log('deleted item: ' + indexItemToRemove);
                this.server.array0.splice(indexItemToRemove,1);
                this.server.array1.splice(indexItemToRemove,1);
                this.server.array2.splice(indexItemToRemove,1);
                this.server.array3.splice(indexItemToRemove,1);
                this.server.array4.splice(indexItemToRemove,1);
                ++this.scores[j].score;
            }
        }
        if (this.server.array0.length <= 0) {
            this.gameRunning = false;
        }
        return deleted;
    }
}