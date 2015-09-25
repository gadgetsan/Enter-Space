//cette feature, si ajoutée à la liste des features, sera généré lors de la création d'une chunk.



//featureDensity: le nombre de fois que l'on ajoute cette feature par chunk que l'on analyse
//maxLength = la longueur maximale des caves pour cette feature
//

var Caves = function(featureDensity, maxLength, maxWidth){
    var self = this;
    self.type = "Caves";

    self.Heads = [];
    self.Tails = [];

    self.maxOnly = false;

    self.maxLength = maxLength;
    self.maxWidth = maxWidth;
    self.density = featureDensity;

    self.GeneratedChunks = [];
}


var Caves_GenerateFeatures = function(object, chunk, chunkLength, chunkSize, originalChunk){
    //on va commencer par aller generer les starter des features à l'interieur du maxLength autour
    //de notre present chunk

    var blockSize = (chunkSize/chunkLength);
    var profiler = new Profiler();
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
                         object.Heads.push([i*chunkSize+chunk[0]+Math.floor((Math.random()-1)*chunkLength)*blockSize,
                                            j*chunkSize+chunk[1]+Math.floor((Math.random()-1)*chunkLength)*blockSize,
                                             k*chunkSize+chunk[2]+Math.floor((Math.random()-1)*chunkLength)*blockSize])
                         object.Tails.push([i*chunkSize+chunk[0]+Math.floor((Math.random()-1)*chunkLength*object.maxLength)*blockSize,
                                            j*chunkSize+chunk[1]+Math.floor((Math.random()-1)*chunkLength*object.maxLength)*blockSize,
                                             k*chunkSize+chunk[2]+Math.floor((Math.random()-1)*chunkLength*object.maxLength)*blockSize])
                     }
                }
            }
        }
    }
    profiler.display("generating new heads and tails");


    //maintenant que les start et les end sont generé pour ce qui nous importe, on peut generé ce qui intersecte notre chunk
    //pour un test, on va aller voir si on a une head dans la chunk, si oui, on 'creuse' une sphere autour
    var inChunkHeads = [];
    for(var i=0; i<object.Heads.length;i++){
        var chunkCenter = [chunk[0], chunk[1], chunk[2]];
        var distanceToChunkCenter = distancePointToSegment(chunkCenter, object.Heads[i], object.Tails[i]);

        if(distanceToChunkCenter<= ((chunkSize)+object.maxWidth)){
            inChunkHeads.push(i);
        }
    }

    profiler.display("fetching essentials heads & tails");

    //finalement, on va modifier le chunk de base pour représenter notre feature

    for(l=0;l<inChunkHeads.length;l++){

        var currentElement = inChunkHeads[l];
        var head = object.Heads[currentElement];
        var tail = object.Tails[currentElement];
        /*
        console.dir("Head " + head);
        console.dir("Tail " + tail);
        */
        var lineDistance = distance(head, tail);
        var lineVector = [(tail[0] - head[0])/lineDistance, (tail[1] - head[1])/lineDistance, (tail[2] - head[2])/lineDistance];
        for(var i=0; i<=chunkLength; i++){
            var x00 = (chunk[0]+i*blockSize);
            for(var j=0; j<=chunkLength; j++){
                var x01 = (chunk[1]+j*blockSize);
                for(var k=0; k<=chunkLength; k++){
                    var inCave = false;
                    if(originalChunk[i][j][k] == 0){
                        continue;
                    }
                    var x0 = [x00, x01, (chunk[2]+k*blockSize)];

                    //pour chaque point on doit calculer sa distance avec la droite formée par la tête et la queue
                    //var locationOnLine = dot(x0, lineVector);

                    var displacementY = 0;//PerlinNoise.noise((locationOnLine)/50, 0.8, 0.8)*100;
                    var displacementX = 0;//PerlinNoise.noise(0.8, (locationOnLine)/50, 0.8)*100;
                    var displacementZ = 0;//PerlinNoise.noise(0.8, 0.8, (locationOnLine)/50)*100;
                    x0[0]+= displacementX;
                    x0[1]+= displacementY;
                    x0[2]+= displacementZ;

                    var x1 = head;//[head[0]+Math.random(), head[1]+Math.random(), head[2]+Math.random()];
                    var x2 = tail;//[tail[0]+Math.random(), tail[1]+Math.random(), tail[2]+Math.random()];
                    var dist = distancePointToSegment(x0, x1, x2);

                    if(dist <= (object.maxWidth)){
                        inCave = true;
                        originalChunk[i][j][k]=0;
                    }
                    if(dist < 1){
                        originalChunk[i][j][k]=3;
                    }
                }
            }
        }
    }

    profiler.display("modifying data for " + inChunkHeads.length + " tunnels");
    return originalChunk;
}
