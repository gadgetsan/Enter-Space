Geo = {
    DegToRad: (deg)->
      return deg * Math.PI / 180

    RadToDeg: (rad)->
        return rad * 180 / Math.PI;

    Slice:(cube, starts, lengths, granularity = 1) ->
        sliced = []
        for i in [starts[0] .. starts[0]+lengths[0]*granularity] by granularity
            slicedI = (i-starts[0])/granularity
            sliced.push([])
            for j in [starts[1] .. starts[1]+lengths[1]*granularity] by granularity
                slicedJ = (j-starts[1])/granularity
                sliced[slicedI].push([])
                for k in [starts[2] .. starts[2]+lengths[2]*granularity] by granularity
                    if i < cube.length and cube[i] and j < cube[i].length and cube[i][j] and k < cube[i][j].length
                        sliced[slicedI][slicedJ].push(cube[i][j][k])
                    else
                        sliced[slicedI][slicedJ].push(0)

        return sliced

    SliceToArray: (cube, starts, lengths) ->
        sliced = []
        for i in [starts[0] .. starts[0]+lengths[0]]
            if cube[i]
                for j in [starts[1] .. starts[1]+lengths[1]]
                    if cube[i][j]
                        for k in [starts[2] .. starts[2]+lengths[2]]
                            if(cube[i][j][k] && cube[i][j][k].Polies.length > 0)
                                for l in [0 .. cube[i][j][k].Polies.length-1]
                                    sliced.push(cube[i][j][k].Polies[l])

        return sliced

}
