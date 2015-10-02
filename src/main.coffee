main = () ->
    timeNow = new Date().getTime()
    lastTime = timeNow;

    manager = new GameManager();

    GL.clearColor(1.0, 1.0, 1.0, 1.0)


    animate = () ->
        #Calcul du temps
        timeNow = new Date().getTime()
        dt = timeNow - lastTime

        #Préparation du background et du viewport
        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        #mettre a jour le jeu
        manager.Update(dt)

        lastTime = timeNow
        window.requestAnimationFrame(animate)

    animate()
