
/**
 * server side game logic
 */

let THREE = require('../public/javascripts/three.min') // "include" three.min.js

module.exports = class GameBase {

    constructor(maxplay){
        // maximum number of players
        this.maxPlayers = maxplay
        // array to store players
        this.avatars = new Array(this.maxPlayers)
        // array to store scores
        this.scores = new Array(this.maxPlayers)
        // array to store objects to grab
        //this.itemsToGrab = new Array(100)
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
    }

    initialise() {
        // current player count
        this.numPlayers = 0;
        for(let i = 0; i < this.maxPlayers; i++) {
        	this.avatars[i] = new Array(3)
			this.avatars[i][0] = null
			this.avatars[i][1] = null
			this.avatars[i][2] = null
		}

        // initialise array itemsToGrab
        this.createItems()
    }

    addPlayer() {
        if (this.numPlayers < this.maxPlayers) {
            // add player
            this.numPlayers += 1
			//this.avatars[this.numPlayers - 1] = new Array(3)
            this.avatars[this.numPlayers - 1][0] = 0
			this.avatars[this.numPlayers - 1][1] = 0
            this.avatars[this.numPlayers - 1][2] = 0// = this.numPlayers //placeholder for: new THREE.Object3D(); start position 0,0,0
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
			//this.avatars[player] = position
			this.avatars[player] = position
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
        return this.server;
    }


	////////////////////////////////////////////////////
	///////////////  SERVER GAME LOGIC    //////////////
	////////////////////////////////////////////////////

	createItems(){
		/*
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
            this.server.array2[i] = offset+0.01;
            this.server.array3[i] = this.myWorld.edge1  * 9/10 * (Math.random()-0.5);
            this.server.array4[i] = this.myWorld.edge2  * 9/10 * (Math.random()-0.5);
        }
	}


	randomColor(){
		/*
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
		This function selects a random size within a range
		@return: Number
			Number denoting random size
		*/
		"use strict";
		return this.myAvatar.headRadius*(1+2*Math.random()-0.5)+this.myAvatar.bodyWidth*3/2;
	}

    detectCollision(j){
	/*
    Description: 
        This function detects the contact between the avatars and the items
    @input j: number
        player number
    @return: 
        void
    */
    "use strict";
        for (let i=0;i<this.server.array0.length;++i){
            let dist;
            let distance2D = Math.sqrt(Math.pow(this.avatars[j].position.x-this.server.array2[i],2)+
                Math.pow(this.avatars[j].position.z-this.server.array4[i],2));
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
            if(	distance2D <= dist){
                //TODO tell client to remove item with code below...
                //scene.remove(itemsToGrab[i]);
                //itemsToGrab.splice(i,1);//update clients with this IF CHANGED (FLAG)
                ++this.scores[j];
            }
        }
	}
}