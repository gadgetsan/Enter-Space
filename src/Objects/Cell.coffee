class Cell extends GameObject
    constructor: (size, length, @AllData, cellVertexLocationRelativeToUser, @GridAbsBFLocation, userVertexLocation) ->
        super()

        @BlockSize = size / length
        @Size = size
        @Length = length

        #On initialise les données de la coupe pour cette cellule
        #l'emplacement ou cette cellule commence en coordoné de Grille
        sliceStart = [
            userVertexLocation[0]+cellVertexLocationRelativeToUser[0]*@Size,
            userVertexLocation[1]+cellVertexLocationRelativeToUser[1]*@Size,
            userVertexLocation[2]+cellVertexLocationRelativeToUser[2]*@Size
        ]
        #console.log(sliceStart)
        #La taille est en quantité de Block de taille BlockSize et non de taille 1
        @CurrentSlice = [sliceStart, [length, length, length]]

        #ON initialise les données d'une mouvement de cellule
        @MoveSinceLastSlice = [0,0,0]

        #l'emplacement absolue ou cet Cellule commence
        @CellStartLocation = [@GridAbsBFLocation[0]+@CurrentSlice[0][0], @GridAbsBFLocation[1]+@CurrentSlice[0][1], @GridAbsBFLocation[2]+@CurrentSlice[0][2]]

        #On coupe les données generales pour obtenir notre cope de données
        @Data = Geo.Slice(@AllData, @CurrentSlice[0], @CurrentSlice[1], @BlockSize )

        #au debut, on initialise la geometry de cet cellules
        @BlockGrid = MCGenerateCellBlock(@Data, @BlockSize, 1, @CellStartLocation)

        @CanCollide = false
        @Refresh()
        #console.dir(@Vertices)


    AddSlice: (sliceMove) ->

        #On va naviguer pour savoir la direction du mouvement

        #console.log("oldSliceStart: " + @CurrentSlice[0])
        @CurrentSlice[0][0] += sliceMove[0]*@BlockSize
        @CurrentSlice[0][1] += sliceMove[1]*@BlockSize
        @CurrentSlice[0][2] += sliceMove[2]*@BlockSize
        @CellStartLocation = [@GridAbsBFLocation[0]+@CurrentSlice[0][0], @GridAbsBFLocation[1]+@CurrentSlice[0][1], @GridAbsBFLocation[2]+@CurrentSlice[0][2]]
        #console.log("SliceStart: " + @CurrentSlice[0])
        #console.log("SliceMove: " + sliceMove)

        for i in [0..2]

            if(sliceMove[i] == 1)
                #On ajoute la modification du au mouvement
                sliceToGetStart = [@CurrentSlice[0][0], @CurrentSlice[0][1], @CurrentSlice[0][2]]
                sliceToGetStart[i] = @CurrentSlice[0][i]+@Size-@BlockSize
                sliceToGetSize = [@CurrentSlice[1][0], @CurrentSlice[1][1], @CurrentSlice[1][2]]
                sliceToGetSize[i] = 1

                #on va regenerer le Render
                dataSlice = Geo.Slice(@AllData, sliceToGetStart, sliceToGetSize, @BlockSize )
                #console.log("SliceToGetStart: " + sliceToGetStart)
                #console.log("sliceToGetSize: " + sliceToGetSize)
                sliceStartLocation = vec3.clone(@CellStartLocation)
                sliceStartLocation[i]+=@Size-@BlockSize
                sliceGrid = MCGenerateCellBlock(dataSlice, @BlockSize, 1, sliceStartLocation)

                #Finalement, on va modifier(déplacer) notre @BlockGrid pour ajouter la slice
                if i == 0
                    @BlockGrid.push(sliceGrid[0])
                    @BlockGrid.shift()
                for x in [0 .. @Length-1]
                    if i == 1
                        @BlockGrid[x].push(sliceGrid[x][0])
                        @BlockGrid[x].shift()
                    for y in [0 .. @Length-1]
                        if i == 2
                            @BlockGrid[x][y].push(sliceGrid[x][y][0])
                            @BlockGrid[x][y].shift()

            else if(sliceMove[i] == -1)
                #On ajoute la modification du au mouvement
                sliceToGetStart = [@CurrentSlice[0][0], @CurrentSlice[0][1], @CurrentSlice[0][2]]
                sliceToGetStart[i] = @CurrentSlice[0][i]
                sliceToGetSize = [@CurrentSlice[1][0], @CurrentSlice[1][1], @CurrentSlice[1][2]]
                sliceToGetSize[i] = 1

                #on va regenerer le Render
                dataSlice = Geo.Slice(@AllData, sliceToGetStart, sliceToGetSize, @BlockSize )
                #console.log("SliceToGetStart: " + sliceToGetStart)
                #console.log("sliceToGetSize: " + sliceToGetSize)
                sliceStartLocation = vec3.clone(@CellStartLocation)
                sliceGrid = MCGenerateCellBlock(dataSlice, @BlockSize, 1, sliceStartLocation)

                #Finalement, on va modifier(déplacer) notre @BlockGrid pour ajouter la slice
                if i == 0
                    @BlockGrid.pop()
                    @BlockGrid.unshift(sliceGrid[0])
                for x in [0 .. @Length-1]
                    if i == 1
                        @BlockGrid[x].pop()
                        @BlockGrid[x].unshift(sliceGrid[x][0])
                    for y in [0 .. @Length-1]
                        if i == 2
                            @BlockGrid[x][y].pop()
                            @BlockGrid[x][y].unshift(sliceGrid[x][y][0])



        #@Data = Geo.Slice(@AllData, @CurrentSlice[0], @CurrentSlice[1], @BlockSize)

        #au debut, on initialise la geometry de cet cellules
        #@BlockGrid = MCGenerateCellBlock(@Data, @Size/@Length, 1, @CellStartLocation)
        #console.log(@CellStartLocation)
        #console.log("")

        @Refresh()

        #mat4.translate(@Renderable.MVmatrix, @Renderable.MVmatrix, @TotalSliceMove)


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
        @MoveSinceLastSlice[0] += move[0]
        @MoveSinceLastSlice[1] += move[1]
        @MoveSinceLastSlice[2] += move[2]
        if(@Renderable)
            mat4.translate(@Renderable.MVmatrix, @Renderable.MVmatrix, move)
            @Renderable.offset[0] += move[0]
            @Renderable.offset[1] += move[1]
            @Renderable.offset[2] += move[2]


        #On va commencer par aller voir si on s'est assez déplacé pour ajouter une Slice
        addSlice = [0, 0, 0]
        for i in [0..2]
            if @MoveSinceLastSlice[i] < -1*@BlockSize
                addSlice[i] -= 1
                @MoveSinceLastSlice[i] += @BlockSize
            else if @MoveSinceLastSlice[i] > @BlockSize
                addSlice[i] += 1
                @MoveSinceLastSlice[i] -= @BlockSize

        if addSlice[0] != 0 or addSlice[1] != 0 or addSlice[2] != 0
            @AddSlice(addSlice)

    Refresh: ()->
        renderData = Geo.SliceToArray(@BlockGrid, [0, 0, 0], [@BlockGrid.length-1, @BlockGrid.length-1, @BlockGrid.length-1])
        first = true
        if(renderData.length > 0)
            @Renderable = new Renderable()
            @Renderable.position = renderData
            #@Renderable.drawType = GL.LINES
            @Renderable.indices = [0 .. @Renderable.position.length/3 -1 ]
            @Renderable.color = []
            for i in [0 .. @Renderable.position.length/3]
                pos =  [@Renderable.position[i*3], @Renderable.position[i*3+1]+50, @Renderable.position[i*3+2]]
                distance = Math.sqrt(pos[0]*pos[0]+pos[1]*pos[1]+pos[2]*pos[2])
                distNormalized = (distance-40)/20
                @Renderable.color.push(distNormalized, distNormalized, distNormalized, 1.0)
            @needsUpdate = true
        else
            @Renderable = null
    Update: (dt)->
        #mat4.rotate(@Renderable.MVmatrix, @Renderable.MVmatrix, 0.001*dt, [1, 0, 0])
        super(dt)
