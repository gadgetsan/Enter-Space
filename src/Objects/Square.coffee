class Square extends GameObject
    constructor: () ->
        super
        @Renderable = new Renderable()
    Update: (dt)->
        mat4.rotate(@Renderable.MVmatrix, @Renderable.MVmatrix, 0.02, [1, 0, 0])
        super(dt)
