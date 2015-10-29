console.log("Test Start")

dataSize = 100
chunkSize = 30
dataName = "Test"

geo = new GeoData(dataName, chunkSize, dataSize)
console.assert(geo.Name == dataName, "GeoData Name")
console.assert(geo.ChunkSize == chunkSize, "GeoData ChunkSize")

generatedData = new GeoGen(dataSize)
#10+1 parce qu'on a 10 espaces et non 10 données!
console.assert(generatedData.Data.length == dataSize+1, "GeoGen Datasize")

#geo.Upload(generatedData)

geo.GetSlice([10, 10, 40], [40, 20, 40], 1, (error, result)->
    console.dir(result)
)
