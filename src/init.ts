//LES CONTANTES
var GRAV = 6.67408 * Math.pow(10, -11)

var CANVAS = <HTMLCanvasElement>document.getElementById("canvas")

CANVAS.width=window.innerWidth
CANVAS.height=window.innerHeight

//var GL = null;
try{    
    var GL = CANVAS.getContext("experimental-webgl")
}
catch (e){
    alert("Your browser is not webgl compatible :(") 
}

GL.enable(GL.DEPTH_TEST);