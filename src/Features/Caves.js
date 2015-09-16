//cette feature, si ajoutée à la liste des features, sera généré lors de la création d'une chunk.



//featureDensity: le nombre de fois que l'on ajoute cette feature par chunk que l'on analyse
//maxLength = la longueur maximale des caves pour cette feature
//

var Caves = function(featureDensity, maxLength, maxWidth){
    var self = this;
    self.type = "Caves";

    self.Heads = [];
    self.Tails = [];

    self.maxOnly = true;

    self.maxLength = maxLength;
    self.maxWidth = maxWidth;
    self.density = featureDensity;

    self.GeneratedChunks = [];
}


var Caves_GenerateFeatures = function(object, chunk, chunkLength, chunkSize, originalChunk){
    //on va commencer par aller generer les starter des features à l'interieur du maxLength autour
    //de notre present chunk
    for(var i=-object.maxLength; i<=object.maxLength; i++){
        for(var j=-object.maxLength; j<=object.maxLength; j++){
            for(var k=-object.maxLength; k<=object.maxLength; k++){
                if(object.GeneratedChunks[i]  == null || object.GeneratedChunks[i][j] == null || object.GeneratedChunks[i][j][k] == null){
                    //ça veux dire qu'on a jamais generé pour ce chunk, on va donc ajouté ses starters
                     Math.seedrandom((i+chunk[0])+","+(j+chunk[1])+","+(k+chunk[2]));
                     //console.log("Seed: "+(i+chunk[0])+","+(j+chunk[1])+","+(k+chunk[2]) + ": "+ Math.random());

                     //pour savoir la quantité qu'on va en mettre
                     var qtForChunk = Math.floor(Math.random()+object.density);
                     for(var l=0;l<qtForChunk;l++){
                         object.Heads.push([i*chunkSize+chunk[0]*chunkSize+Math.floor(Math.random()*chunk.length)*(chunkSize/chunk.length),
                                            j*chunkSize+chunk[1]*chunkSize+Math.floor(Math.random()*chunk.length)*(chunkSize/chunk.length),
                                             k*chunkSize+chunk[2]*chunkSize+Math.floor(Math.random()*chunk.length)*(chunkSize/chunk.length)])
                         object.Tails.push([i*chunkSize+chunk[0]*chunkSize+Math.floor(Math.random()*chunk.length*object.maxLength)*(chunkSize/chunk.length),
                                            j*chunkSize+chunk[1]*chunkSize+Math.floor(Math.random()*chunk.length*object.maxLength)*(chunkSize/chunk.length),
                                             k*chunkSize+chunk[2]*chunkSize+Math.floor(Math.random()*chunk.length*object.maxLength)*(chunkSize/chunk.length)])
                     }
                }
            }
        }
    }

    //maintenant que les start et les end sont generé pour ce qui nous importe, on peut generé ce qui intersecte notre chunk
    //pour un test, on va aller voir si on a une head dans la chunk, si oui, on 'creuse' une sphere autour
    var inChunkHeads = [];
    for(var i=0; i<object.Heads.length;i++){
        var chunkCenter = [chunkSize*chunk[0]+chunkSize/2, chunkSize*chunk[1]+chunkSize/2, chunkSize*chunk[2]+chunkSize/2];
        var distanceToChunkCenter = distancePointToSegment(chunkCenter, object.Heads[i], object.Tails[i]);

        if(distanceToChunkCenter<= ((chunkSize)+object.maxWidth)){
            inChunkHeads.push(i);
        }
    }
    var blockSize = chunkSize/chunkLength;

    //finalement, on va modifier le chunk de base pour représenter notre feature
    for(var i=0; i<=chunkLength; i++){
        for(var j=0; j<=chunkLength; j++){
            for(var k=0; k<=chunkLength; k++){
                var inCave = false;
                for(l=0;l<inChunkHeads.length;l++){
                    //pour chaque point on doit calculer sa distance avec la droite formée par la tête et la queue
                    var currentElement = inChunkHeads[l];
                    var x0 = [(chunkSize*chunk[0]+i*blockSize), (chunkSize*chunk[1]+j*blockSize), (chunkSize*chunk[2]+k*blockSize)];

                    var head = object.Heads[currentElement];
                    var tail = object.Tails[currentElement];
                    var lineDistance = distance(head, tail);
                    var lineVector = [(tail[0] - head[0])/lineDistance, (tail[1] - head[1])/lineDistance, (tail[2] - head[2])/lineDistance];
                    var locationOnLine = dot(x0, lineVector);

                    var displacementY = PerlinNoise.noise((locationOnLine)/50, 0.8, 0.8)*100;
                    var displacementX = PerlinNoise.noise(0.8, (locationOnLine)/50, 0.8)*100;
                    var displacementZ = PerlinNoise.noise(0.8, 0.8, (locationOnLine)/50)*100;
                    x0[0]+= displacementX;
                    x0[1]+= displacementY;
                    x0[2]+= displacementZ;

                    var x1 = head;//[head[0]+Math.random(), head[1]+Math.random(), head[2]+Math.random()];
                    var x2 = tail;//[tail[0]+Math.random(), tail[1]+Math.random(), tail[2]+Math.random()];
                    var dist = distancePointToSegment(x0, x1, x2);

                    if(dist <= (object.maxWidth)){
                        //console.log(currentLocation + " vs " + inChunkHeads[l] + " = "+ Math.sqrt(distance));
                        inCave = true;
                        break;
                    }
                }
                if(inCave){
                    originalChunk[i][j][k]=0;
                }
            }
        }
    }
    return originalChunk;
}