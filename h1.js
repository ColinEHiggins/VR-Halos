
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
	// Determination of the aspect ratio
	var aspectRatio = canvas.width / canvas.height;
    
    var verts = makeTorus(0.3, 0.15, 42, 40); //makeTorus(0.7, 0.3, 15.0, 15.0, 1.0);
    var verts2 = makeTorus(0.7, 0.15, 42, 40);
	for(var i = 0; i < verts2.length; i++)
	{
		verts.push(verts2[i]);
	} 
	vnum = verts.length;
	//
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 ); // black
    gl.enable(gl.DEPTH_TEST);
	

	
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verts), gl.STATIC_DRAW );
	 
    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
    render();
};


function render() 
{
    gl.clear( gl.COLOR_BUFFER_BIT |  gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.LINE_STRIP, 0, vnum);
}

function makeTorus(radius, tube, radialSegments, tubularSegments) {
	var vertices = [];
	var arc = Math.PI*2; 
	var j, i;

	// generate vertices, normals and uvs

	for ( j = 0; j <= radialSegments; j ++ ) {

		for ( i = 0; i <= tubularSegments; i ++ ) {

			var u = i / tubularSegments * arc;
			var v = j / radialSegments * Math.PI * 2;

			// vertex

			var x = ( radius + tube * Math.cos( v ) ) * Math.cos( u );
			var y = ( radius + tube * Math.cos( v ) ) * Math.sin( u );
			var z = tube * Math.sin( v );

			vertices.push( vec3(x,y,z) );
		}

	}
	return vertices;
}

