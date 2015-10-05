class Cell extends GameObject
    constructor: () ->
        super()

        @Renderable = new Renderable()
        @Renderable.drawType = GL.TRIANGLE_STRIP
        @Renderable.position = []
        @Renderable.color = []
        @Renderable.indices = []

        size = 5;
        length = 100;
        stepSize =  size/length
        for i in [0..length-1]
            for j in [0..length-1]
                height = OctavePerlin(i*stepSize,j*stepSize, 0.9, 4, 0.5)
                @Renderable.position.push(i*stepSize)
                @Renderable.position.push(height*2)
                @Renderable.position.push(j*stepSize)
                @Renderable.color.push(height*1.5)
                @Renderable.color.push(height+0.5)
                @Renderable.color.push(height*1.5)
                ###
                @Renderable.color.push(height/2)
                @Renderable.color.push(0.5+height/4)
                @Renderable.color.push(height/2)
                ###
                @Renderable.color.push(1.0)


        for i in [0..length-2]
            if i % 2 == 0 #Even Rows
                for j in [0..length-1]
                    @Renderable.indices.push(j+i*length)
                    @Renderable.indices.push(j+((i+1)*length))
            else
                for j in [length-1..1]
                    @Renderable.indices.push(j+((i+1)*length))
                    @Renderable.indices.push(j - 1 + (i*length))


    AddLine: (move) ->
        ###
        #ON va modifier le buffer pour enlever la premiere ligne et mettre la dernière à la place
        GL.bindBuffer(GL.ARRAY_BUFFER, @Renderable.buffers["position"])
        GL.bufferSubData(GL.ARRAY_BUFFER, 0, new Float32Array([++@Renderable.position[1]]))

        #ON doit aussi modifier les index
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, @Renderable.buffers["indices"])
        GL.bufferSubData(GL.ELEMENT_ARRAY_BUFFER, 0, new Float32Array([++@Renderable.position[1]]))
        ###

    CameraMoved: (move, Camera) =>
        #On suit la camera avec l'emplacement, mais on deplace les vertex dans le Shader pour créer l'illusion qu'on avance

        mat4.translate(@Renderable.MVmatrix, @Renderable.MVmatrix, move)
        @Renderable.offset[0] += move[0]
        @Renderable.offset[1] += move[1]
        @Renderable.offset[2] += move[2]
        @AddLine(move)


    Update: (dt)->
        #mat4.rotate(@Renderable.MVmatrix, @Renderable.MVmatrix, 0.001*dt, [1, 0, 0])
        super(dt)
