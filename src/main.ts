/// <reference path="GameManager.ts"/>

function main() {
    var timeNow = new Date().getTime();
    var lastTime = timeNow;
    
    var manager = new GameManager();
    
    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    
    function animate() {
        //calcul du temps
        timeNow = new Date().getTime();
        var dt= timeNow - lastTime;
        
        //préparation du background et du viewport
        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);        
        
        //mettre a jour le jeu
        manager.update(dt)

        lastTime = timeNow
        window.requestAnimationFrame(animate)
    }
    
    animate();
}