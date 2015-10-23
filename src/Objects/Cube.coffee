class Cube extends GameObject
    constructor: ()->
        super()
        @Renderable = new CubeRenderable()
        @Mass = 10
        #Escape Velocity`sqrt(2*G*Mass/r)
        @Velocity = [1.0, -0.3, 0]
        @UpdatePosition([0,2,1])

    Update: (dt)->
        super(dt)
