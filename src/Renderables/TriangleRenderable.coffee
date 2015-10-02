class TriangleRenderable
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
        @vertexCount = 3


        @position = [
            -1.0, -1.0,  0.0,
             0.0,  1.0,  0.0,
             1.0,  -1.0,  0.0,
        ]

        @color = [
            1.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
        ]
        @indices = [0,1,2]
