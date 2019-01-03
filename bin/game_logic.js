
/**
 * server side game logic
 */

let three = require('../public/javascripts/three.min') // "include" three.min.js

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
		for (let i=0;i<itemsToGrab.length;++i){
			let radius = myAvatar.headRadius*(1+2*Math.random()-0.5)+myAvatar.bodyWidth*3/2;
			let geometry = randomGeometry();
			let offset = 0;
			let material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, 
													shininess: 50, 
													color:randomColor()});
			itemsToGrab[i] = new THREE.Mesh(geometry, material);
			if(geometry.type === "SphereGeometry"){
				offset = geometry.parameters.radius;
			}
			if(geometry.type === "BoxGeometry"){
				offset = geometry.parameters.height/2;
			}
			if(geometry.type === "CylinderGeometry"){
				offset = geometry.parameters.height/2;
			}
			itemsToGrab[i].position.y = offset+0.01;
			itemsToGrab[i].position.x = myWorld.edge1  * 9/10 * (Math.random()-0.5);
			itemsToGrab[i].position.z = myWorld.edge2  * 9/10 * (Math.random()-0.5);
			scene.add(itemsToGrab[i]);
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
			return new THREE.SphereGeometry(randomSize(), 10, 10);
		}
		else if(selectGeo < 2/3){
			let size = randomSize();
			return new THREE.CylinderGeometry(size, size, size, 16);
		}
		else{
			let size = randomSize();
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
		return myAvatar.headRadius*(1+2*Math.random()-0.5)+myAvatar.bodyWidth*3/2;
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
    for (let i=0;i<itemsToGrab.length;++i){
    	let dist;
    	let distance2D = Math.sqrt(Math.pow(avatars[j].position.x-itemsToGrab[i].position.x,2)+
			Math.pow(avatars[j].position.z-itemsToGrab[i].position.z,2));
    	if(itemsToGrab[i].geometry.type === "SphereGeometry"){
			dist = itemsToGrab[i].geometry.parameters.radius;
		}
		else if(itemsToGrab[i].geometry.type === "BoxGeometry"){
			dist = itemsToGrab[i].geometry.parameters.width*1.2;
		}
		else if(itemsToGrab[i].geometry.type === "CylinderGeometry"){
			dist = itemsToGrab[i].geometry.parameters.radiusTop;
		}
		else{
			dist = 0;
		}
		if(	distance2D <= dist){
			scene.remove(itemsToGrab[i]);
			itemsToGrab.splice(i,1);//update clients with this IF CHANGED (FLAG)
			++scores[j];
		}
	}
	}
}