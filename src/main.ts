/// <reference path="GameManager.ts"/>
var DEBUG = true;
function main() {
    var timeNow = new Date().getTime();
    var lastTime = timeNow;
        
    GL.clearColor(0.53725, 0.7960, 0.87843, 1.0);
    
    //on créé la scène
    var sceneFactory = new SceneFactory();
    var scene = sceneFactory.get(null);
    
    //on ajoute le FPS Count
    
    function animate() {
        //calcul du temps
        timeNow = new Date().getTime();
        var dt= timeNow - lastTime;
        
        //préparation du background et du viewport
        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);        
        
        //mettre a jour le jeu
        scene.update(dt)
        
        scene.render();

        lastTime = timeNow
        debug(dt);
        window.requestAnimationFrame(animate)
    }
    
    animate();
}

function debug(dt: number){
    if(!DEBUG){
        return;
    }
    // look up the elements we want to affect
    var fpsElement = document.getElementById("fps");
    
    // Add those text nodes where they need to go
    fpsElement.innerText = "FPS: " + (1000/dt);
}
