class CubeRenderable extends Renderable
    constructor: ()->
        @MVmatrix = mat4.create()
        #Les autres seront les matrices Identité (pour le moment)
        mat4.identity(@MVmatrix);

        @bufferable = true
        @needsUpdate = true
        @drawType = GL.TRIANGLES
        @usesIndices = true
        @buffers = []
        @counts = []
        @offset=[0,0,0]

        @position = [
            -1.0, -1.0,  -1.0,
            -1.0,  1.0,  -1.0,
            1.0,  1.0,  -1.0,
            1.0, -1.0,  -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0
        ]

        @color = [
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ]
        @indices = [
            0,1,2,
            2,3,0

            0,1,5,
            5,4,0,

            1,2,6,
            6,5,1,

            2,3,7,
            7,6,2,

            3,0,4,
            4,7,3,

            4,5,6,
            6,7,4
        ]
