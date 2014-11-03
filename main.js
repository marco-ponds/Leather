include("bliss");

var board;
var cons = document.getElementById("console");
var leapController;
var hands = [
	{
		mesh : undefined,
		position : [0,0,0],
		roll : 0,
		fingers : [
			{
				mesh : undefined,
				position : [0,0,0],
				roll : 0
			},
			{
				mesh : undefined,
				position : [0,0,0],
				roll : 0
			},
			{
				mesh : undefined,
				position : [0,0,0],
				roll : 0
			},
			{
				mesh : undefined,
				position : [0,0,0],
				roll : 0
			},
			{
				mesh : undefined,
				position : [0,0,0],
				roll : 0
			}
		]
	},
	{
		mesh : undefined,
		position : [0,0,0],
		roll : 0,
		fingers : [
			{
				mesh : undefined,
				position : [0,0,0],
				roll : 0
			},
			{
				mesh : undefined,
				position : [0,0,0],
				roll : 0
			},
			{
				mesh : undefined,
				position : [0,0,0],
				roll : 0
			},
			{
				mesh : undefined,
				position : [0,0,0],
				roll : 0
			},
			{
				mesh : undefined,
				position : [0,0,0],
				roll : 0
			}
		]
	}
];
var info, palm, phalanges = [], collidables = [];


function onLeapSocketConnected() {
	l("Leap socket connected.", "i");
}

function onLeapDeviceConnected() {
	l("Leap Device connected.", "i");
}

function onLeapDeviceDisconnected() {
	l("Leap Device disconnected.", "i");
}

progressAnimation = function(callback) {
	console.log("my progress");
	$('#loader').animate({"opacity" : "0", "margin-top" : "250px"}, 1000 , function () {
		$('#loader').remove();	
		$('body').animate({backgroundColor : "#fff"}, 200 , callback);
	});
}

var geometry, material, mesh, palms = [], phalanges = [];

function onCreate() {
	/***************
		USAGE
		core.add(obj);
		we can add _render method to obj

	****************/

	//core.add(obj);
	//core.camera.position.y = 2;
	//core.camera.position.z = 6;
	core.camera.position.set(0, 400, 600);
	core.camera.lookAt(new THREE.Vector3(0,0, -200));

	//console.log("inside onCreate");

	var light = new THREE.AmbientLight( 0x333333);
	light.color.setHSL( 0.1, 0.5, 0.3 );
	light._render = function() {};
	core.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 0, 500, 0 );
	light.castShadow = true;
	light.shadowMapWidth = 2048;
	light.shadowMapHeight = 2048;
	var d = 200;
	light.shadowCameraLeft = -d;
	light.shadowCameraRight = d;
	light.shadowCameraTop = d * 2;
	light.shadowCameraBottom = -d * 2;

	light.shadowCameraNear = 100;
	light.shadowCameraFar = 600;
	//light.shadowCameraVisible = true;
	core.add( light );
	//console.log("created lights");

	// ground plane
	material = new THREE.MeshLambertMaterial( {color: 0xaaaaaa } );
	geometry = new THREE.CubeGeometry( 1000, 10, 1000 );
	//mesh = new THREE.Mesh( geometry, material );
	mesh = new Physijs.BoxMesh(geometry, material,0);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh._render = function(){};
	core.add( mesh );


	createButtons();

	createHands();
	setUpLeap();
	var bliss = new Bliss();

}
/*
function drawGrid() {

	var bottom = new THREE.Mesh(new THREE.PlaneGeometry(10,10), new THREE.MeshBasicMaterial({color:0x6e859f, side:THREE.DoubleSide}));
	bottom.scale.set(2,0.2,1);
	bottom.overdraw = true;
	bottom.rotation.x = Math.PI/2;
	//bottom.rotation.y = Math.PI / 2; //90 degrees
	core.add(bottom);
	bottom._render = function() {}
}
*/

input.keydown = function(event) {

};

input.keyup = function(event) {

};

function createButtons() {
	for (var i=0; i<6; i++) {
		for (var j=0; j<6; j++) {
			//creating test object for collision detection
			var material = new THREE.MeshNormalMaterial({color : "green"});
			var geometry = new THREE.CubeGeometry( 150, 50, 150 );
			//mesh = new THREE.Mesh(geometry, material);
			var mesh = new Physijs.BoxMesh(geometry, material);
			mesh.position.set((i * 150) - 484, 20, (j * 150) - 484);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.firstCollision = true;
			mesh.__id = (i + j);
			mesh._render = function(){};
			core.add( mesh );
		}
	}
}

function createHands() {
	// palm
	geometry = new THREE.CubeGeometry( 80, 20, 80 );
	geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, -30 ) );  // to to +30 if using pitch roll & yaw
	material = new THREE.MeshLambertMaterial({color: ""});
	var palm;
	for (var i=0; i<2; i++) {
		palm = new THREE.Mesh( geometry, material );
		//palm = new Physijs.BoxMesh(geometry, material);
		palm.castShadow = true;
		palm.receiveShadow = true;
		palm.position.set(0,10,0);
		palm._render = function() {};
		palms.push(palm);
		//collidables.push(palm);
		core.add( palms[i]);
	}
	//console.log("created palm");
	// phalanges
	geometry = new THREE.CubeGeometry( 16, 12, 1 );
	for ( var i = 0; i < 30; i++) {
		if (((i+1) % 3) == 0) {
			//ultima parte del dito
			//mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
			mesh = new Physijs.BoxMesh(geometry, new THREE.MeshNormalMaterial(), 0);
			mesh.addEventListener("collision", function(other, v) {
				console.log("collided");
				console.log(other.__id);
			});
			mesh._render = function() {
				this.__dirtyPosition = true;
				this.__dirtyRotation = true;
				//this._physijs.linearVelocity = new THREE.Vector3(0,0,0);
				//this._physijs.angularVelocity = new THREE.Vector3(0,0,0);
			};
			collidables.push(mesh);
		} else {
			mesh = new THREE.Mesh( geometry, material );
			mesh._render = function() {};
		}
		//mesh = new Physijs.BoxMesh(geometry, material);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		core.add( mesh );
		phalanges.push( mesh );
	}

	//console.log("created phalanges");
}

var did = false;
function setUpLeap() {
	Leap.loop( {enableGestures : true}, function( frame ) {
		var hand, phalanx, point, length;
		hlen = frame.hands.length;
		for (var i=0; i<hlen; i++) {
			hand = frame.hands[i];
			palms[i].position.set( hand.palmPosition[0], hand.palmPosition[1], hand.palmPosition[2] );
//			palm.rotation.set( hand.pitch(), -hand.yaw(), hand.roll() );
			direction = new THREE.Vector3( hand.direction[0], hand.direction[1], hand.direction[2] );  // best so far
			palms[i].lookAt( direction.add( palms[i].position ) );
			palms[i].rotation.z = -hand.roll();

			//data.innerHTML = 'Hand X:' + hand.palmPosition[0].toFixed(0) + ' Y:' +  hand.palmPosition[1].toFixed(0) + ' Z:' + hand.palmPosition[2].toFixed(0);
		}
		iLen = frame.pointables.length;//( frame.pointables.length < 5 ) ? frame.pointables.length : 5;
		for (var i = 0; i < iLen; i++) {
			for ( var j = 0; j < 3; j++) {
				phalanx = phalanges[ 3 * i + j];
				point = frame.pointables[i].positions[j];
				phalanx.position.set( point[0], point[1], point[2] );
				phalanx.__dirtyPosition = true;
				point = frame.pointables[i].positions[ j + 1 ];
				point = new THREE.Vector3( point[0], point[1], point[2] );
				phalanx.lookAt( point );
				phalanx.__dirtyRotation = true;
				length = phalanx.position.distanceTo( point );
				phalanx.translateZ( 0.5 * length );
				phalanx.scale.set( 1, 1, length );
			}
		}
	});
}

function handleScreenTap(gesture) {

	var material = new THREE.MeshNormalMaterial( {color: 0x000000 } );
	var geometry = new THREE.CubeGeometry( 10, 10, 10 );
	var cube = new THREE.Mesh(geometry, material);
	cube.position.set(gesture.position[0], gesture.position[1], gesture.position[2]);
	core.add(cube);
}

function handleKeyTap(gesture) {
	var material = new THREE.MeshNormalMaterial( {color: 0xcccccc } );
	var geometry = new THREE.CubeGeometry( 10, 10, 10 );
	var cube = new THREE.Mesh(geometry, material);
	cube.position.set(gesture.position[0], gesture.position[1], gesture.position[2]);
	core.add(cube);
}


