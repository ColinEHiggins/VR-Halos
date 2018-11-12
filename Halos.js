
var gl;
var newvertices = [];
var xrot = 0;
var yrot = 0;
var zrot = 0;
var currentxrot = 0;
var currentyrot = 0;
var currentzrot = 0;
var vertices = [];
var bufferId;
var cBufferId;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    vertices = [
      [-0.5,-0.5,0],[0,0.5,0],[0.5,-0.5,0],
      [-0.5,-0.5,0],[0.5,0,0],[-0.5,0.5,0],
      [-0.5,0.5,0],[0,-0.5,0],[0.5,0.5,0],
    ]

    whichMatrix = [
      1,1,1,
      2,2,2,
      3,3,3
    ]
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var wBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 4*9, gl.STATIC_DRAW );
    var wMatrix = gl.getAttribLocation( program, "whichMatrix" );
    gl.vertexAttribPointer( wMatrix, 1, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( wMatrix );

    gl.bindBuffer(gl.ARRAY_BUFFER, wBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(whichMatrix));

    document.getElementById("x-slider").onchange = function(event){
      xrot = event.target.value/180 * Math.PI;
      render( );
    };
    document.getElementById("y-slider").onchange = function(event){
      yrot = event.target.value/180 * Math.PI;
      render();
    };
    document.getElementById("z-slider").onchange = function(event){
      zrot = event.target.value/180 * Math.PI;
      render();
    };
    // Associate out shader variables with our data buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    rotation1 = gl.getUniformLocation( program, "rotationMatrix1" );
    rotation2 = gl.getUniformLocation( program, "rotationMatrix2" );
    rotation3 = gl.getUniformLocation( program, "rotationMatrix3" );
    render();
};


function render() {
  currentxrot = (currentxrot + xrot)%360
  currentyrot = (currentyrot + yrot)%360
  currentzrot = (currentzrot + zrot)%360
  var xrotationMatrix = mat3(
    1,0,0,
    0,Math.cos(currentxrot),-Math.sin(currentxrot),
    0,Math.sin(currentxrot),Math.cos(currentxrot)
  );
  var yrotationMatrix = mat3(
    Math.cos(currentyrot),0,Math.sin(currentyrot),
    0,1,0,
    -Math.sin(currentyrot),0,Math.cos(currentyrot)
  );
  var zrotationMatrix = mat3(
    Math.cos(currentzrot),-Math.sin(currentzrot),0,
    Math.sin(currentzrot),Math.cos(currentzrot),0,
    0,0,1
  );
  gl.uniformMatrix3fv( rotation1, false, flatten(xrotationMatrix));
  gl.uniformMatrix3fv( rotation2, false, flatten(yrotationMatrix));
  gl.uniformMatrix3fv( rotation3, false, flatten(zrotationMatrix));
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays( gl.TRIANGLES, 0, 9 );
  window.requestAnimFrame(render)
}
