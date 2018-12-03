// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();
var cameraLocation = 1;
// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var user = new THREE.Group();
var cameraLocationOne = new THREE.Object3D();
cameraLocationOne.translateY(-1.3);
var cl1 = new THREE.Group();
cl1.add(cameraLocationOne)
var cameraLocationTwo = new THREE.Object3D();
cameraLocationTwo.translateX(0.8);
var cl2 = new THREE.Group();
cl2.add(cameraLocationTwo)
var cameraLocationThree = new THREE.Object3D();
cameraLocationThree.translateY(-0.3);
var cl3 = new THREE.Group();
cl3.add(cameraLocationThree)
user.add( camera );
scene.add(user);
user.translateZ(3);
// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});
document.body.appendChild( WEBVR.createButton( renderer ) );
// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.vr.enabled = true;
// Append Renderer to DOM
document.body.appendChild( renderer.domElement );
console.log(camera.position,"hi");

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
var texture = new THREE.TextureLoader().load( 'texture1.jpg' );
var geometry = new THREE.TorusGeometry( 1.5, 0.2, 80, 100 );
var material = new THREE.MeshBasicMaterial( { map: texture } );
var torus = new THREE.Mesh( geometry, material );

var texture2 = new THREE.TextureLoader().load( 'texture1.jpg' );
var geometry2 = new THREE.TorusGeometry( 1., 0.2, 80, 100 );
var material2 = new THREE.MeshBasicMaterial( { map: texture2 } );
var torus2 = new THREE.Mesh( geometry2, material2 );

var texture3 = new THREE.TextureLoader().load( 'texture1.jpg' );
var geometry3 = new THREE.TorusGeometry( 0.5, 0.2, 80, 100 );
var material3 = new THREE.MeshBasicMaterial( { map: texture3 } );
var torus3 = new THREE.Mesh( geometry3, material3 );

// Add halos to Scene
scene.add( torus );
scene.add( torus2 );
scene.add( torus3 );
scene.add( cl1 );
scene.add( cl2 );
scene.add( cl3 );

console.log(torus.position,"torus");
document.addEventListener( 'mousedown', onDocumentMouseDown, false );

var projector = new THREE.Projector();

function onDocumentMouseDown( event ) {
	var raycaster = new THREE.Raycaster();
	var vector = new THREE.Vector3(
        ( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1,
        0.5
    );

	raycaster.setFromCamera( vector, camera);
	var intersects = raycaster.intersectObjects(scene.children);

	for ( var i = 0; i < intersects.length; i++ )
	{
		intersects[ i ].object.material.color.set( 0xff0000 );
	}
}


// Render Loop
var render = function () {
	cl1.rotation.x += 0.01;
	cl2.rotation.y += 0.02;
	cl3.rotation.z += 0.03;
	cl1.updateMatrixWorld();
	console.log(cameraLocationOne.position,"One");
	console.log(cameraLocationTwo.position,"Two");
	console.log(cameraLocationThree.position,"Three");
	console.log(cl1.rotation,"One");
	console.log(cl2.rotation,"Two");
	console.log(cl3.rotation,"Three");
	if (cameraLocation == 1){
		user.position = cameraLocationOne.position;
	}
	else if (cameraLocation == 2) {
		user.position = cameraLocationTwo.position;
	}
	else if (cameraLocation == 3) {
		user.position = cameraLocationThree.position;
	}
  requestAnimationFrame( render );
	torus.rotation.x += 0.01;

  torus2.rotation.y += 0.02;

  torus3.rotation.z += 0.03;
  // Render the scene
	console.log(user.position,"Camera Position");
	renderer.setAnimationLoop( function () {
		renderer.render( scene, camera );
	});

};

render();
