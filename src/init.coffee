CANVAS=document.getElementById("canvas")

CANVAS.width=window.innerWidth
CANVAS.height=window.innerHeight

GL = false
try
    GL = CANVAS.getContext("experimental-webgl", antialias: false)
catch e
    alert("Your browser is not webgl compatible :(") 

GL.enable(GL.DEPTH_TEST);