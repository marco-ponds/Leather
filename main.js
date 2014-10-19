var mesh;
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

function onCreate() {
	/***************
		USAGE
		core.add(obj);
		we can add _render method to obj

	****************/

	//core.add(obj);
		core.camera.position.y = 2;
		core.camera.position.z = 6;

		//var geometry = new THREE.CubeGeometry(1.5,1.5,1.5);
		var cubeMaterials = [
		    new THREE.MeshNormalMaterial({color:0x33AA55, transparent:false}),
		    new THREE.MeshNormalMaterial({color:0x55CC00, transparent:false}),
		    new THREE.MeshNormalMaterial({color:0x000000, transparent:false}),
		    new THREE.MeshNormalMaterial({color:0x000000, transparent:false}),
		    new THREE.MeshNormalMaterial({color:0x0000FF, transparent:false}),
		    new THREE.MeshNormalMaterial({color:0x5555AA, transparent:false}),
		];
		var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
		var loader = new THREE.JSONLoader(true);
		//loading left hand
		loader.load(
		    "models/left_hand.js",
		    function(geometry,materials) {
		    	hands[1].mesh = new THREE.Mesh(geometry, cubeMaterial);
		        hands[1].mesh._render = function(){};
		        hands[1].mesh.position.set(0,0,0);
		        //hands[1].mesh.rotation.set(0,-90,0);
		        hands[1].mesh.scale.set(0.2,0.2,0.2);
		        hands[1].mesh._render = function() {
					//l(hands[1].position);
					this.position.set(hands[1].position[0] - 6, -hands[1].position[1], hands[1].position[2]);
					this.rotation.z = hands[1].roll;
				};
		        core.add(hands[1].mesh);
		    }
		);
		//loading right hand
		loader.load(
		    "models/right_hand.js",
		    function(geometry,materials) {
		    	hands[0].mesh = new THREE.Mesh(geometry, cubeMaterial);
		        hands[0].mesh.position.set(0,0,0);
		        //hands[0].mesh.rotation.set(0,-90,0);
		        hands[0].mesh.scale.set(0.2,0.2,0.2);
		        hands[0].mesh._render = function() {
					//l(hands[0].position);
					//this.position.set(hands[0].position[0] - 6, -hands[0].position[1], hands[0].position[2]);
					//this.rotation.z = hands[0].roll;
				};
		        core.add(hands[0].mesh);
		    }
		);

		//hands[0].mesh = new THREE.Mesh(geometry, cubeMaterial);
		//hands[1].mesh = new THREE.Mesh(geometry, cubeMaterial);
		//var cube = new THREE.Mesh(geometry, cubeMaterial);
		/*
		hands[0].mesh._render = function() {
			//l(hands[0].position);
			this.position.set(hands[0].position[0] - 6, -hands[0].position[1], hands[0].position[2]);
			this.rotation.z = hands[0].roll;
		};
		hands[1].mesh._render = function() {
			//l(hands[1].position);
			this.position.set(hands[1].position[0] - 6, -hands[1].position[1], hands[1].position[2]);
			this.rotation.z = hands[1].roll;

		};

		*/
		
		for (var i=0; i<10; i++) {
			var s_geometry = new THREE.SphereGeometry( 0.1, 20, 20 );
			var s_material = new THREE.MeshNormalMaterial( {color: 0x00ff00} );
			if (i<5) {
				hands[0].fingers[i].mesh = new THREE.Mesh(s_geometry, s_material);
				hands[0].fingers[i].mesh._index = i;
				hands[0].fingers[i].mesh._render = function() {
					/*if (hands[0].fingers[this._index].position!=undefined) {
						//setting visibility to true
						this.visibility = true;
						this.position.set(hands[0].fingers[this._index].position[0], hands[0].fingers[this._index].position[1] , hands[0].fingers[this._index].position[2]);
					} else {
						this.visibility = false;
					}*/
				}
				hands[0].fingers[i].mesh.visibility = false;
				core.add(hands[0].fingers[i].mesh);
			} else {
				hands[1].fingers[i-5].mesh = new THREE.Mesh(s_geometry, s_material);
				hands[1].fingers[i-5].mesh._index = i-5;
				hands[1].fingers[i-5].mesh._render = function() {
					/*if (hands[1].fingers[this._index].position!=undefined) {
						//setting visibility to true
						this.visibility = true;
						this.position.set(hands[1].fingers[this._index].position[0], hands[1].fingers[this._index].position[1], hands[1].fingers[this._index].position[2]);
					} else {
						this.visibility = false;
					}*/
				}
				hands[1].fingers[i-5].mesh.visibility = false;
				core.add(hands[1].fingers[i-5].mesh);
			}
		}
		

		//core.add(cube);
		//core.add(hands[0].mesh);
		//core.add(hands[1].mesh);



		setUpLeap();

}

input.keydown = function(event) {

};

input.keyup = function(event) {

};
var did = false;
function setUpLeap() {

	leapController = new Leap.Controller();

	/********************
		setting up leap
	********************/
	leapController.on("connect", onLeapSocketConnected);
	leapController.on("deviceConnected", onLeapDeviceConnected);
	leapController.on("deviceDisconnected", onLeapDeviceDisconnected);
	Leap.loop(function(frame) {
		frame.hands.forEach(function(hand, index) {
			var pos = hand.screenPosition();
			if (index in hands) {
				//OLD CODE
				//hands[index].position = _.each(pos, function(e,i,l) {pos[i] = pos[i]/100;})
				//hands[index].roll = hand.roll();

				//NEW CODE
				hands[index].mesh.position.set(pos[0] - 6, pos[1], pos[2]);
				hands[index].mesh.rotation.z = hand.roll();
				//pos =  _.each(pos, function(e,i,l) {pos[i] = pos[i]/100;});
				//hands[index].mesh.position.set(pos[0] -6, -pos[1], pos[2]);
				//get every finger
				var fingers = hand.fingers;
				for (var i=0; i< 5; i++) {
					if (i >= fingers.length) {
						//non è un dito visibile
						//hands[index].fingers[i].position = undefined;
						hands[index].fingers[i].mesh.visibility = false;
					} else {
						var f_pos = fingers[i].tipPosition;
						//hands[index].fingers[i].position = _.each(f_pos, function(e,i,l) {f_pos[i] = f_pos[i]/100;});
						hands[index].fingers[i].position.set(f_pos[0], f_pos[1], f_pos[2]);
						hands[index].fingers[i].mesh.visibility = true;
						if (!did) {
							did = true;
							l(fingers[i].tipPosition);
							l(hands[index].fingers[i].position);
							l(hands[index].position);
						}
					}
				}
			}
		});
		// #num of fingers frame.fingers.length
	});
}


