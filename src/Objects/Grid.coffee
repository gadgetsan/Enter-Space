#Une Grille contiens est en fait un Object en 3 dimension qui peut avoir plusieurs
#Degrés de details dependant de la distance à la camera
class Grid extends GameObject
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
        ###
        @Renderable.position = [
            -1.0*length, -1.0*length,  0.0,
            -1.0*length,  1.0*length,  0.0,
             1.0*length,  1.0*length,  0.0,
             1.0*length, -1.0*length,  0.0
        ]
        ###
        #mat4.rotate(@Renderable.MVmatrix, @Renderable.MVmatrix, -1.57079632679, [1, 0, 0])
        #mat4.translate(@Renderable.MVmatrix, @Renderable.MVmatrix, [-size/2, -size/2, 0.0])

    Update: (dt)->
        #mat4.rotate(@Renderable.MVmatrix, @Renderable.MVmatrix, 0.001*dt, [1, 0, 0])
        super(dt)
