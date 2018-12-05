// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();
var cameraLocation = 0;
var lastLocation = 0;
// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 0.1, 1000 );
var user = new THREE.Group();

user.add( camera );
scene.add(user);
user.translateZ(350);

var ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);
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
var geometry = new THREE.TorusGeometry( 150, 20, 80, 100 );
var material = new THREE.MeshLambertMaterial( { map: texture } );
//material = new THREE.MeshLambertMaterial({ color: 0xffffff });
var torus = new THREE.Mesh( geometry, material );
torus.castShadow = true;
torus.receiveShadow = true;

var texture2 = new THREE.TextureLoader().load( 'texture1.jpg' );
var geometry2 = new THREE.TorusGeometry( 100, 20, 80, 100 );
var material2 = new THREE.MeshLambertMaterial( { map: texture2 } );
var torus2 = new THREE.Mesh( geometry2, material2 );
torus2.castShadow = true;
torus2.receiveShadow = true;

var texture3 = new THREE.TextureLoader().load( 'texture1.jpg' );
var geometry3 = new THREE.TorusGeometry( 50, 20, 80, 100 );
var material3 = new THREE.MeshLambertMaterial( { map: texture3 } );
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
		}
		else if (intersectRadius > 100) {
			console.log('torus2');
			cameraLocation = 2;
		}
		else {
			console.log('torus3');
			cameraLocation = 3;
		}
	}
}

// Render Loop
var render = function () {
	cl1.rotation.x += 0.01;
	cl2.rotation.y += 0.02;
	cl3.rotation.z += 0.03;
	if (cameraLocation == 1){
		temp = cameraLocationOne.getWorldPosition(new THREE.Vector3(0, 0, 0));
		user.position.set(temp.x,temp.y,temp.z);
		if (lastLocation!=1){
			user.rotation.x = torus.rotation.x+Math.PI/2;
			user.rotation.y = 0;
			user.rotation.z = 0;
			lastLocation = 1;
		}
		user.rotation.x+= 0.01;
	}
	else if (cameraLocation == 2) {
		temp = cameraLocationTwo.getWorldPosition(new THREE.Vector3(0, 0, 0));
		user.position.set(temp.x, temp.y, temp.z);
		user.position.set(temp.x, temp.y, temp.z);
		if (lastLocation != 2) {
			user.rotation.x = 0;
			user.rotation.y = torus2.rotation.y+Math.PI/2;
			user.rotation.z = Math.PI/2;
			lastLocation = 2;
		}
		user.rotation.y += 0.02;
	}
	else if (cameraLocation == 3) {
		temp = cameraLocationThree.getWorldPosition(new THREE.Vector3(0, 0, 0));
		user.position.set(temp.x, temp.y, temp.z);
		if (lastLocation != 3) {
			user.rotation.x = 0;
			user.rotation.y = 0;
			user.rotation.z = torus3.rotation.z;
			lastLocation = 3;
		}
		user.rotation.z += 0.03
	}
  	requestAnimationFrame( render );
	torus.rotation.x += 0.01;
  	torus2.rotation.y += 0.02;
  	torus3.rotation.z += 0.03;
	renderer.setAnimationLoop( function () {
		renderer.render( scene, camera );
	});
};
render();
