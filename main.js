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
var info, palm, phalanges = [];


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

	console.log("inside onCreate");

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
	console.log("created lights");

	// ground plane
	material = new THREE.MeshLambertMaterial( {color: 0xaaaaaa } );
	geometry = new THREE.CubeGeometry( 600, 10, 300 );
	mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh._render = function(){};
	core.add( mesh );
	console.log("created ground plane");
	// palm
	geometry = new THREE.CubeGeometry( 80, 20, 80 );
	geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, -30 ) );  // to to +30 if using pitch roll & yaw
	material = new THREE.MeshNormalMaterial();
	var palm;
	for (var i=0; i<2; i++) {
		palm = new THREE.Mesh( geometry, material );
		palm.castShadow = true;
		palm.receiveShadow = true;
		palm._render = function() {};
		palms.push(palm);
		core.add( palms[i]);
	}
	console.log("created palm");
	// phalanges
	geometry = new THREE.CubeGeometry( 16, 12, 1 );
	for ( var i = 0; i < 30; i++) {
		mesh = new THREE.Mesh( geometry, material );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh._render = function() {};
		core.add( mesh );
		phalanges.push( mesh );
	}

	console.log("created phalanges");


	setUpLeap();

}

function drawGrid() {

	var bottom = new THREE.Mesh(new THREE.PlaneGeometry(10,10), new THREE.MeshBasicMaterial({color:0x6e859f, side:THREE.DoubleSide}));
	bottom.scale.set(2,0.2,1);
	bottom.overdraw = true;
	bottom.rotation.x = Math.PI/2;
	//bottom.rotation.y = Math.PI / 2; //90 degrees
	core.add(bottom);
	bottom._render = function() {}
}

input.keydown = function(event) {

};

input.keyup = function(event) {

};
var did = false;
function setUpLeap() {
	Leap.loop( function( frame ) {
		var hand, phalanx, point, length;
		for ( var i in frame.hands) {
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
				point = frame.pointables[i].positions[ j + 1 ];
				point = new THREE.Vector3( point[0], point[1], point[2] );
				phalanx.lookAt( point );
				length = phalanx.position.distanceTo( point );
				phalanx.translateZ( 0.5 * length );
				phalanx.scale.set( 1, 1, length );
			}
		}
	});
}


