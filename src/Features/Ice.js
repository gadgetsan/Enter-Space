
var Ice = function(height){
    var self = this;
    self.type = "Ice";
    self.height = height;
    self.maxOnly = false;
}


var Ice_GenerateFeatures = function(object, chunk, chunkLength, chunkSize, originalChunk){

    var blockSize = chunkSize/chunkLength;
    //on va modifier le chunk pour ajouter les ores
    for(var i=0; i<=chunkLength; i++){
        for(var j=0; j<=chunkLength; j++){
            for(var k=0; k<=chunkLength; k++){
                //var exactLocation = [(chunkSize*chunk[0]+i*blockSize), (chunkSize*chunk[1]+j*blockSize), (chunkSize*chunk[2]+k*blockSize)];
                if(originalChunk[i][j][k] == 1 && (chunkSize*chunk[1]+j*blockSize) > object.height){
                    originalChunk[i][j][k] = 3;
                }
            }
        }
    }
    return originalChunk;
}
