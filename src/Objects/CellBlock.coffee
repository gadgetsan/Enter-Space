#Représente un Block de terrain, on s'en sert pour regenenerer une Cellule

class CellBlock
    constructor: (@Position)->
        @Polies = []


    AddVertex: (poly) ->
        @Polies.push(poly[0] + @Position[0])
        @Polies.push(poly[1] + @Position[1])
        @Polies.push(poly[2] + @Position[2])

    GetIndices: ()->
        return [0 .. @polies.length/3]
