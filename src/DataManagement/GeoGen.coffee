class GeoGen
    constructor: (@totalLength) ->

        heightMap = []
        polarStepLength = (Math.PI*2)/@totalLength
        scale = 0.25;
        @Data = []

        sphereSize = @totalLength/2
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
