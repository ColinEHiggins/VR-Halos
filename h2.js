// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();
var cameraLocation = 0;
var lastLocation = 0;
var set0 = false;
var set1 = false;
var set2 = false;
var set3 = false;

// Setup for locking the cursor
/* // other vars
var controlsEnabled = false;
var raycaster2;


var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
			if ( havePointerLock ) {
				var element = document.body;
				var pointerlockchange = function ( event ) {
					if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
						controlsEnabled = true;
						controls.enabled = true;
					} else {
						controlsEnabled = false;
						controls.enabled = false;
					}
				};
				var pointerlockerror = function ( event ) {
						console.log("Oops");
				};
				// Hook pointer lock state change events
				document.addEventListener( 'pointerlockchange', pointerlockchange, false );
				document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
				document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
				document.addEventListener( 'pointerlockerror', pointerlockerror, false );
				document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
				document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
			}  */
			
// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 0.1, 1000 );
var user = new THREE.Group();

var listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
var sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
// adds ambient music to the scene
var audioLoader = new THREE.AudioLoader();
audioLoader.load('ambient.wav', function (buffer) {
	sound.setBuffer(buffer);
	sound.setLoop(true);
	sound.setVolume(0.05);
	sound.play();
});




user.add( camera );
scene.add(user);
user.translateZ(350);

//create Lighting
var light = new THREE.DirectionalLight( 0xFFFFFF);
light.position.set(200,200,200);
light.target.position.set(0,0,0);
light.shadow.camera.near = 0;
light.shadow.camera.far = 15;
light.shadow.camera.left = -5;
light.shadow.camera.right = 5;
light.shadow.camera.top = 5;
light.shadow.camera.bottom = -5;
light.castShadow = true;
scene.add(light);
console.log(light)

var ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);

//var helper = new THREE.DirectionalLightHelper(light, 50);
//scene.add(helper)

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});
document.body.appendChild( WEBVR.createButton( renderer ) );
// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.vr.enabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
// Append Renderer to DOM
document.body.appendChild( renderer.domElement );
console.log(camera.position,"hi");

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Creates and textures 3 halos
var texture = new THREE.TextureLoader().load( 'texture1.jpg' );
var displacementMapTexture = new THREE.TextureLoader().load('Displacement.png');
var geometry = new THREE.TorusGeometry( 150, 20, 80, 100 );
//var material = new THREE.MeshLambertMaterial( { map: texture } );
var material = new THREE.MeshPhongMaterial({ map: texture, color: 0x00ffff, displacementMap: displacementMapTexture, displacementScale: 10 });
var torus = new THREE.Mesh( geometry, material );
torus.castShadow = true;
torus.receiveShadow = true;

var texture2 = new THREE.TextureLoader().load( 'texture1.jpg' );
var geometry2 = new THREE.TorusGeometry( 100, 20, 80, 100 );
var normalMapTexture = new THREE.TextureLoader().load('Normal.png');
var material2 = new THREE.MeshPhongMaterial({ map: texture, color: 0x00ffff, normalMap: normalMapTexture, bumpScale: 10 });
var torus2 = new THREE.Mesh( geometry2, material2 );
torus2.castShadow = true;
torus2.receiveShadow = true;

var texture3 = new THREE.TextureLoader().load( 'texture1.jpg' );
var geometry3 = new THREE.TorusGeometry( 50, 20, 80, 100 );
var bumpMapTexture = new THREE.TextureLoader().load('Bump.png');
var material3 = new THREE.MeshPhongMaterial({ map: texture, color: 0x00ffff, bumpMap: bumpMapTexture, bumpScale: 20 });
var torus3 = new THREE.Mesh( geometry3, material3 );
torus3.castShadow = true;
torus3.receiveShadow = true;
console.log(torus.castShadow)

// generates background particles
var material4 = new THREE.PointsMaterial({ color: 0xffffff, size: 1, sizeAttenuation: false });
var geometry4 = new THREE.Geometry();
var x, y, z;
var i;
for (i = 0; i < 15000; i++) 
{
      x = (Math.random() * 1500) - 750;
      y = (Math.random() * 1500) - 750;
      z = (Math.random() * 1500) - 750;
      
      geometry4.vertices.push(new THREE.Vector3(x, y, z));
}
    
    var pointCloud = new THREE.Points(geometry4, material4);

var cameraLocationOne = new THREE.Object3D()
cameraLocationOne.translateY(-125);
var cl1 = new THREE.Group();
cl1.add(cameraLocationOne);
var cameraLocationTwo = new THREE.Object3D();
cameraLocationTwo.translateX(75);
var cl2 = new THREE.Group();
cl2.add(cameraLocationTwo)
var cameraLocationThree = new THREE.Object3D();
cameraLocationThree.translateY(-25);
var cl3 = new THREE.Group();
cl3.add(cameraLocationThree)




// Add halos and particles to scene
scene.add( cl1 );
scene.add( cl2 );
scene.add( cl3 );
scene.add( torus );
scene.add( torus2 );
scene.add( torus3 );
scene.add(pointCloud);

console.log(torus.position,"torus");

// checks to see if mouse position overlaps with any of the points contained by 
// any of the halos
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
var radians = 0.03;
var move = 5;
var fwd = false;
var bwd = false;
var right = false;
var left = false;
var up = false;
var down = false;

document.addEventListener( 'keydown', onKeyDown, false );

function onKeyDown( event ) 
{
	if(cameraLocation == 0)
	{
		switch( event.keyCode ) {
		case 87: // w (move forward) -z
			fwd = true;
			break;
		case 65: //a (move left) -x
			left = true;
			break;
		case 82: //r (move up)
			up = true;
			break;
		case 70: // f (move down)
			down = true;
			break;
		case 83: // s (move backward) +z
			bwd = true;
			break;
		case 68: // d(move right) +x
			right = true;
			break;
		}
	}
	switch( event.keyCode ) 
	{
        case 37: // left arrow (look left)
			camera.rotateY( radians );
			break;

        case 39: // right arrow (look right)
			camera.rotateY( -radians );
			break;

        case 38: // up arrow (look up)
			camera.rotateX( radians );
			break;

        case 40: // down arrow (look down)
			camera.rotateX( -radians );
			break;

		case 48: // number 0 (jump outside toruses)
			cameraLocation = 0;
			set0 = true;
			break;

		case 49: // number 1 (jump to outermost torus)
			cameraLocation = 1;
			set1 = true;
			break;

		case 50: // number 2 (jump to middle torus)
			cameraLocation = 2;
			set2 = true;
			break;

		case 51: // number 3 (jump to innermost torus)
			cameraLocation = 3;
			set3 = true;
			break;
    }  
}
document.addEventListener( 'keyup', onKeyUp, false );

function onKeyUp( event ) 
{
    switch( event.keyCode ) {
		case 87: // w (move forward) -z
			fwd = false;
			break;
		case 82: //r (move up)
			up = false;
			break;
		case 70: // f (move down)
			down = false;
			break;
		case 65: //a (move left) -x
			left = false;
			break;
		
		case 83: // s (move backward) +z
			bwd = false;
			break;
		case 68: // d(move right) +x
			right = false;
			break;
    }
}
		

function onDocumentMouseDown( event ) {
	var raycaster = new THREE.Raycaster();
	var vector = new THREE.Vector3(
        ( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1,
        0.5
    );

	raycaster.setFromCamera( vector, camera);
	var intersects = raycaster.intersectObjects(scene.children);
	if(intersects.length!=0){
		intersectRadius = intersects[0].object.geometry.boundingSphere.radius
		console.log(intersectRadius,"IntersectRadius")
		if (intersectRadius > 150){
			console.log('torus');
			cameraLocation = 1;
			set1 = true;
		}
		else if (intersectRadius > 100) {
			console.log('torus2');
			cameraLocation = 2;
			set2 = true;
		}
		else {
			console.log('torus3');
			cameraLocation = 3;
			set3 = true;
		}
	}
	// Kept here in case mouse rotation will be used later. Allows us to lock the cursor
 	/* // Ask the browser to lock the pointer
 	element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
	if ( /Firefox/i.test( navigator.userAgent ) ) {
		var fullscreenchange = function ( event ) {
			if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
				document.removeEventListener( 'fullscreenchange', fullscreenchange );
				document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
				element.requestPointerLock();
			}
		};
		document.addEventListener( 'fullscreenchange', fullscreenchange, false );
		document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
		element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
		element.requestFullscreen();
	} else {
		element.requestPointerLock();
	}
	raycaster2 = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );  */
}


// Render Loop
var render = function () {
  	if (cameraLocation == 0 && set0) {
		user.position.set(0, 0, 350);
		if (lastLocation != 0 || set0) {
			user.rotation.x = 0;
			user.rotation.y = 0;
			user.rotation.z = 0;
			lastLocation = 0;
			camera.rotation.x = 0;
			camera.rotation.y = 0;
			camera.rotation.z = 0;
			set0 = false;
		}
	}
	if (cameraLocation == 1 && set1){
		temp = cameraLocationOne.getWorldPosition(new THREE.Vector3(0, 0, 0));
		user.position.set(temp.x,temp.y,temp.z);
		if (lastLocation!=1){
			user.rotation.x = torus.rotation.x+Math.PI/2;
			user.rotation.y = 0;
			user.rotation.z = 0;
			lastLocation = 1;
			camera.rotation.x = 0;
			camera.rotation.y = 0;
			camera.rotation.z = 0;
		}
		user.rotation.x += 0.01;
	}
	else if (cameraLocation == 2 && set2) {
		temp = cameraLocationTwo.getWorldPosition(new THREE.Vector3(0, 0, 0));
		user.position.set(temp.x, temp.y, temp.z);
		if (lastLocation != 2) {
			user.rotation.x = 0;
			user.rotation.y = torus2.rotation.y+Math.PI/2;
			user.rotation.z = Math.PI/2;
			lastLocation = 2;
			camera.rotation.x = 0;
			camera.rotation.y = 0;
			camera.rotation.z = 0;
		}
		user.rotation.y += 0.01;
	}
	else if (cameraLocation == 3 && set3) {
		temp = cameraLocationThree.getWorldPosition(new THREE.Vector3(0, 0, 0));
		user.position.set(temp.x, temp.y, temp.z);
		if (lastLocation != 3) {
			user.rotation.x = 0;
			user.rotation.y = 0;
			user.rotation.z = torus3.rotation.z;
			lastLocation = 3;
			camera.rotation.x = 0;
			camera.rotation.y = 0;
			camera.rotation.z = 0;
		}
		user.rotation.z += 0.01;
	}  

	var axis = new THREE.Vector3();
	axis = camera.getWorldDirection(axis);
	var angToConvert = 90 * Math.PI / 180;
	
	if(fwd)
	{
		user.translateOnAxis(axis, move);
		set0 = false;
	}
	if(bwd)
	{
		user.translateOnAxis(axis, -move);
		set0 = false;
	}
	if(right)
	{
		user.position.x+=move;
/* 		axis.applyAxisAngle(new THREE.Vector3(0, 1, 0), angToConvert);
		user.translateOnAxis(axis, -move); */
		set0 = false;
	}
	if(left)
	{
		user.position.x-=move;
/* 		axis.applyAxisAngle(new THREE.Vector3(0, 1, 0), angToConvert);
		user.translateOnAxis(axis, move); */
		set0 = false;
	}
	
	if(up)
	{
		user.position.y+=move;
		set0 = false;
	}
	
	if(down)
	{
		user.position.y-=move;
		set0 = false;
	}	
	
  	requestAnimationFrame( render );
	torus.rotation.x += 0.01;
  	torus2.rotation.y += 0.01;
	torus3.rotation.z += 0.01;

	
	
	cl1.rotation.x += 0.01;
	cl2.rotation.y += 0.01;
	cl3.rotation.z += 0.01;
	
	renderer.setAnimationLoop( function () {
		renderer.render( scene, camera );
	});
};
render();
