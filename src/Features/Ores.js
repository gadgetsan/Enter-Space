
var Ores = function(featureDensity, depositType, depositSize, precision){
    var self = this;
    self.type = "Ores";
    self.OreType = depositType;

    self.size = depositSize;
    self.density = 1/featureDensity;
    self.maxOnly = false;
    self.precision = precision;

    self.GeneratedChunks = [];
}


var Ores_GenerateFeatures = function(object, chunk, chunkLength, chunkSize, originalChunk){
    var self = object;
    var blockSize = chunkSize/chunkLength;
    //on va modifier le chunk pour ajouter les ores
    for(var i=0; i<=chunkLength-self.precision; i+=self.precision){
        var currentX = (chunk[0]+(i-(chunkLength/2))*blockSize);
        var exactX = currentX/(100*self.density);
        for(var j=0; j<=chunkLength-self.precision; j+=self.precision){
            var currentY = (chunk[1]+(j-(chunkLength/2))*blockSize);
            var exactY = currentY/(100*self.density);
            for(var k=0; k<=chunkLength-self.precision; k+=self.precision){
                var currentZ = (chunk[2]+(k-(chunkLength/2))*blockSize);
                var exactLocation = [currentX, currentY, currentZ];
                var exactZ = exactLocation[2]/(100*self.density);
                if(originalChunk[i][j][k] != 0 && PerlinNoise.noise(exactX, exactY, exactZ) < self.size){
                    for(var l=0; l< self.precision; l++){
                        for(var m=0; m< self.precision; m++){
                            for(var n=0; n< self.precision; n++){
                                originalChunk[i+l][j+m][k+n] = self.OreType;
                            }
                        }
                    }
                }
            }
        }
    }
    return originalChunk;
}
