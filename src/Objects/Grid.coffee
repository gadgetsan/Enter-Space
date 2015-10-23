#Une Grille contiens est en fait un Object en 3 dimension qui peut avoir plusieurs
#Degrés de details dependant de la distance à la camera
class Grid extends GameObject
    constructor: (length, size, location, @totalLength) ->
        super()
        #on n'as pas le choix si on veut que ses enfants s'affichent
        @Renderable = new Renderable()
        @Location = location
        sphereSize = 50

        @blockSize = size/length

        @Length = length
        @Size = size
        @Mass = 1000000000000

        @Data = []

        heightMap = []
        polarStepLength = (Math.PI*2)/@totalLength
        scale = 0.25;
        #Notre Heightmap sera en coordonée polaire
        for i in [0..@totalLength]
            currentPhi = polarStepLength*i
            heightMap.push([])
            #console.log("Generating HeightMap: " + i + "/" + @totalLength)
            for j in [0..@totalLength]
                currentTheta = polarStepLength*j
                x = Math.sin(currentTheta)*Math.cos(currentPhi)
                y = Math.sin(currentTheta)*Math.sin(currentPhi)
                z = Math.cos(currentTheta)
                height = (OctavePerlin(x*scale, y*scale, z*scale, 4, 5)*20)-10
                heightMap[i].push(sphereSize+height)

        #console.dir(heightMap)

        for i in [0..@totalLength]
            @Data.push([])
            #console.log("Generating Data: " + i + "/" + @totalLength)
            x = (i-@totalLength/2)
            for j in [0..@totalLength]
                @Data[i].push([])
                y = (j-@totalLength/2)
                for k in [0..@totalLength]
                    z = (k-@totalLength/2)
                    rho = Math.sqrt((x*x)+(y*y)+(z*z))
                    phi = Math.atan(y/x)+Math.PI
                    theta = Math.acos(z/rho)+Math.PI
                    heightMapI = Math.ceil(phi/polarStepLength)
                    heightMapJ = Math.ceil(theta/polarStepLength)
                    if !heightMap[heightMapI] or rho < heightMap[heightMapI][heightMapJ]
                        @Data[i][j].push(1)
                    else
                        @Data[i][j].push(0)

                    ###
                    location = vec3.fromValues(x, y, z)
                    #console.dir(location)
                    distance = vec3.length(location)
                    #console.log(distance)
                    if distance < (@Length/3)
                        @Data[i][j].push(1)
                    else
                        @Data[i][j].push(0)
                    ###


        #IMPORTANT: CES NOMBRES DOIVENT ÊTRE ENTIERS
        cellSize = @Size /4
        cellLength = @Length /4
        console.dir(@Data)
        console.dir(heightMap)
        @gridStartLocation = [@Location[0]-@totalLength/2, @Location[1]-@totalLength/2, @Location[2]-@totalLength/2]

        #On va ajouter les cellules
        #@CellGrid = MCGenerateCellBlock(@Data, @Size/@Length, 1, @gridStartLocation)
        #console.log("Generation is Done")

        #Les cellules doivent aussi savoir ou est l'utilisateur dès le départ pour pouvoir le suivre
        #TODO: il est possible, si l'utilisateur n'est pas direct sur un point que l'emplacement ne soit pas exacte
        userLocation = [@totalLength/2-location[0]/@blockSize, @totalLength/2-location[1]/@blockSize, @totalLength/2-location[2]/@blockSize]

        #QUALITÉ 1
        for i in [-2 .. 1]
            for j in [-2 .. 1]
                for k in [-2 .. 1]
                    @Children.push(new Cell(cellSize, cellLength, @Data, [i, j, k], @gridStartLocation, userLocation))


        for i in [-2 .. 1]
            for j in [-2 .. 1]
                for k in [-2 .. 1]
                    if(i == 1 || i == -2 || j == 1 || j == -2 || k == 1 || k == -2)
                        #QUALITÉ 2
                        @Children.push(new Cell(cellSize*2, cellLength, @Data, [i, j, k], @gridStartLocation, userLocation))
                        #QUALITÉ 3
                        @Children.push(new Cell(cellSize*4, cellLength, @Data, [i, j, k], @gridStartLocation, userLocation))

        @CenterOfMass = [0,0,0]



    CameraMoved: (move, Camera) =>
        #profiler = new Profiler(1)
        for child in @Children
            child.CameraMoved(move, Camera)
        #profiler.display("updating chunk display")

    Update: (dt)->
        super(dt)
        #Pour chaque enfant avec une masse, on applique la gravité.
        for child in @Children
            #Collision
            if child.CanCollide
                #on calcule la collision pour chaque point renderable (pas juste le centre de masse)
                if(child.Renderable)
                    for i in [0 .. child.Renderable.position.length/3]
                        #On va calculer sa position relative à la grille
                        pointPosition = [child.Renderable.position[i], child.Renderable.position[i+1], child.Renderable.position[i+2]]
                        vec3.add(pointPosition, pointPosition, child.Location)
                        relativePosition = []
                        vec3.sub(relativePosition, pointPosition, @gridStartLocation)
                        gridLocation = [Math.round(relativePosition[0]/@blockSize), Math.round(relativePosition[1]/@blockSize), Math.round(relativePosition[2]/@blockSize)]
                        if @Data[gridLocation[0]] and @Data[gridLocation[0]][gridLocation[1]] and @Data[gridLocation[0]][gridLocation[1]][gridLocation[2]] != 0
                            console.log("Collision detected!!")
                            child.isColliding = true
                            break;
                        else
                            child.isColliding = false
                else
                    relativePosition = []
                    vec3.sub(relativePosition, child.Location, @gridStartLocation)
                    gridLocation = [Math.round(relativePosition[0]/@blockSize), Math.round(relativePosition[1]/@blockSize), Math.round(relativePosition[2]/@blockSize)]
                    if @Data[gridLocation[0]][gridLocation[1]][gridLocation[2]] != 0
                        console.log("Collision detected!!")
                        child.isColliding = true
                    else
                        child.isColliding = false


            #Gravité
            if(child.Mass != 0 )
                delta = []
                vec3.sub(delta, child.Location, @Location)
                distance = vec3.len(delta)
                vec3.normalize(delta, delta)
                accLen = (GRAV * @Mass) / (distance * distance) * (dt/1000)
                acc = []
                vec3.scale(acc, delta, -accLen)
                if( not child.isColliding)
                    vec3.add(child.Velocity, child.Velocity, acc)
                else
                    emptyVector = [0,0,0]
                    vec3.sub(child.Velocity, emptyVector, child.Velocity)
