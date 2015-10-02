class GameManager
    constructor: ()->
        @ShaderProgram = new ShaderProgram(new VertexBasic() , new FragmentBasic())
        @ShaderProgram.Use()

        @Camera = new Camera()
        @Renderer = new Renderer(@ShaderProgram, @Camera)
        @Control = new Control(@Camera)
        @Keyboard = new Keyboard(@Control)

        #Ici on peut créer le Setup Initial
        @GameObjects = [];
        @GameObjects.push(new Grid());

    Update: (dt)->
        @Control.Update(dt)

        for gameObject in @GameObjects
            gameObject.Update(dt)

        @Renderer.UpdateBuffers(@GameObjects, null)
        @Renderer.Render(@GameObjects, null)
