class Triangle extends GameObject
    constructor: () ->
        super
        @Renderable = new TriangleRenderable()
    Update: (dt)->
        mat4.rotate(@Renderable.MVmatrix, @Renderable.MVmatrix, 0.01, [1, 0, 0])
        mat4.rotate(@Renderable.MVmatrix, @Renderable.MVmatrix, 0.01, [0, 1, 0])
        mat4.rotate(@Renderable.MVmatrix, @Renderable.MVmatrix, 0.01, [0, 0, 1])
        super(dt)
