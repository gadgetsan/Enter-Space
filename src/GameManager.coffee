class GameManager
    constructor: ()->
        @ShaderProgram = new ShaderProgram(new VertexBasic() , new FragmentBasic())
        @ShaderProgram.Use()

        @Player = new Player()
        @Renderer = new Renderer(@ShaderProgram, @Player.Camera)
        @Control = new Control(@Player)
        @Keyboard = new Keyboard(@Control)

        #Ici on peut créer le Setup Initial
        @GameObjects = [];
        @Grid = new Grid(40, 40, [0,-50,0], 200)
        @Grid.Add(new Cube())
        @Grid.Add(@Player)
        @GameObjects.push(@Grid);

        @Player.Camera.Subscribe("move", @Grid.CameraMoved)

    Update: (dt)->
        @Control.Update(dt)

        for gameObject in @GameObjects
            gameObject.Update(dt)

        @Renderer.UpdateBuffers(@GameObjects, null)
        @Renderer.Render(@GameObjects, null)
