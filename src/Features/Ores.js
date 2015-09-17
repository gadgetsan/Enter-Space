
var Ores = function(featureDensity, depositType, depositSize){
    var self = this;
    self.type = "Ores";
    self.OreType = depositType;

    self.size = depositSize;
    self.density = 1/featureDensity;
    self.maxOnly = false;

    self.GeneratedChunks = [];
}


var Ores_GenerateFeatures = function(object, chunk, chunkLength, chunkSize, originalChunk){

    var blockSize = chunkSize/chunkLength;
    //on va modifier le chunk pour ajouter les ores
    for(var i=0; i<=chunkLength; i++){
        for(var j=0; j<=chunkLength; j++){
            for(var k=0; k<=chunkLength; k++){
                var exactLocation = [(chunk[0]+(i-(chunkLength/2))*blockSize), (chunk[1]+(j-(chunkLength/2))*blockSize), (chunk[2]+(k-(chunkLength/2))*blockSize)];
                if(originalChunk[i][j][k] != 0 && PerlinNoise.noise(exactLocation[0]/(100*object.density), exactLocation[1]/(100*object.density), exactLocation[2]/(100*object.density)) < object.size){
                    originalChunk[i][j][k] = object.OreType;
                }
            }
        }
    }
    return originalChunk;
}
