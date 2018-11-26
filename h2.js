// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
var texture = new THREE.TextureLoader().load( 'texture1.jpg' );
var geometry = new THREE.TorusGeometry( 2.2, 0.4, 8, 100 );
var material = new THREE.MeshBasicMaterial( { map: texture } );
var torus = new THREE.Mesh( geometry, material );

var texture2 = new THREE.TextureLoader().load( 'texture1.jpg' );
var geometry2 = new THREE.TorusGeometry( 1.2, 0.3, 8, 100 );
var material2 = new THREE.MeshBasicMaterial( { map: texture2 } );
var torus2 = new THREE.Mesh( geometry2, material2 );

var texture3 = new THREE.TextureLoader().load( 'texture1.jpg' );
var geometry3 = new THREE.TorusGeometry( 0.5, 0.2, 8, 100 );
var material3 = new THREE.MeshBasicMaterial( { map: texture3 } );
var torus3 = new THREE.Mesh( geometry3, material3 ); 

// Add halos to Scene
scene.add( torus );
scene.add( torus2 );
scene.add( torus3 ); 

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
  requestAnimationFrame( render );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  torus2.rotation.x += 0.02;
  torus2.rotation.y += 0.02;
  
  torus3.rotation.x += 0.03;
  torus3.rotation.y += 0.03;  

  // Render the scene
  renderer.render(scene, camera);
};

=======
// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
var geometry = new THREE.TorusGeometry( 1, 0.4, 8, 100 );
var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
var torus = new THREE.Mesh( geometry, material );

// Add cube to Scene
scene.add( torus );

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
};

render();