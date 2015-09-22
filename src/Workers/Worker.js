importScripts("../Features/Caves.js");
importScripts("../Features/Ores.js");
importScripts("../Features/Ice.js");
importScripts("../Features/Water.js");
importScripts("../../external/js/seedrandom.js");
importScripts("../Utilities.js");

self.id = 0;

var hnu = 0.5;

self.addEventListener('message', function(e) {
    if(e.data.type == 'setup'){
        self.id = e.data.id;
    }else if(e.data.type == 'hello'){
        self.hello(e.data.data);
    }else if(e.data.type == 'testing'){
        self.testing(e.data.data);
    }else if(e.data.type == 'GenerateInitialChunkList'){
        self.GenerateInitialChunkList(e.data.data);
    }else if(e.data.type == 'GenerateUpdateChunkList'){
        self.GenerateUpdateChunkList(e.data.data);
    }else if(e.data.type == 'ChangeVoxel'){
        self.ChangeVoxel(e.data.data);
    }else if(e.data.type == 'generateChunk'){
        self.generateChunk(e.data.data);
    }else{
        self.postMessage({
            type: 'debug',
            data: 'Received unknown message ' + e.data.type
        });
    }
})

self.ChangeVoxel = function(data){
    var voxelLocation= data.voxelLocation
    var newValue = data.newValue;

    //on commence par décompressé
    var uncompressedData = self.uncompressData(data.compressedData, data.length);
    //on change la valeur
    uncompressedData[voxelLocation[0]][voxelLocation[1]][voxelLocation[2]] = newValue;
    //on recompresse
    var recompressedData = self.compressData(uncompressedData);
    //et on renvoie faire mettre à jour

    params = {
        chunksSize: data.chunksSize,
        length: data.length,
        location: data.location,
        planetLocation: data.planetLocation,
        maxResolution: data.maxResolution,
        compressedData: recompressedData
    }
    //console.dir(params);
    self.generateChunk(params);
}

self.hello = function(message){
    console.log("Hello! " + message);
    self.postMessage({
        type: 'result',
        id: self.id,
        data: 'done by worker #' + self.id
    });
}

self.testing = function(message){

    var data = self.generateData(50, 50, [0,5,0], [0,0,0]);

    var compressedData = self.compressData(data);
    var unCompressedData = self.uncompressData(compressedData, 50);
    var reCompressedData = self.compressData(unCompressedData);

    self.postMessage({
        type: 'result',
        id: self.id,
        data: reCompressedData
    });
}

//Décompression RLE
self.uncompressData = function(compressedData, length){

    var cubeLength = length+1;
    //on va voir si les quantités fonctionnent
    var jChange = cubeLength;
    var iChange = cubeLength * cubeLength;
    var total = 0;
    var uncompressedData = []
    var location = 0;
    for(var m=0; m<compressedData.length; m+=2){
        total += compressedData[m];
        for(var n=0; n<compressedData[m];n++){
            var i = Math.floor(location / iChange);
            var j = Math.floor((location - (i*iChange)) / jChange);
            var k = location % jChange;
            if(uncompressedData[i] == undefined){
                uncompressedData[i] = [];
            }
            if(uncompressedData[i][j] == undefined){
                uncompressedData[i][j] = [];
            }

            uncompressedData[i][j][k] = compressedData[m+1];
            location++;
        }
    }
    return uncompressedData;
}

//Compression RLE
self.compressData = function(data){
    var compressedData = [];
    var lastValue = -1;
    var consecCount = 1;
    //on va compressé les données
    for(var i=0; i<data.length; i++){
        for(var j=0; j<data[i].length; j++){
            for(var k=0; k<data[i][j].length; k++){
                if(data[i][j][k] == lastValue){
                    consecCount++;
                }else{
                    if(lastValue != -1){
                        compressedData.push(consecCount);
                        compressedData.push(lastValue);
                    }
                    consecCount = 1;
                    lastValue = data[i][j][k];
                }
            }
        }
    }
    compressedData.push(consecCount);
    compressedData.push(lastValue);
    return compressedData
}

self.GenerateInitialChunkList = function(data){

    //l'emplacement ou commence l'utilisateur, elle peut changé mais au depart...
    planetLocation = data[0];

    //la taille de la plus petite chunk
    chunkSize = data[1];

    //la taille (en unité) ou la précision de la chunk
    chunkLength = data[2];

    //la taille (en unité) ou la précision de la chunk
    precisions= data[3];
    var debug = data[4];

    priorityQueues = [[]];

    priorityQueues[0].push({
            type: 'update',
            location: [0, 0, 0],
            size: chunkSize,
            length: chunkLength
    });
    var updateLocations = [
        [-1,-1,-1], [-1,-1,0], [-1,-1,1],
        [-1,0,-1], [-1,0,0], [-1,0,1],
        [-1,1,-1], [-1,1,0], [-1,1,1],
        [0,-1,-1], [0,-1,0], [0,-1,1],
        [0,0,-1], [0,0,1],
        [0,1,-1], [0,1,0], [0,1,1],
        [1,-1,-1], [1,-1,0], [1,-1,1],
        [1,0,-1], [1,0,0], [1,0,1],
        [1,1,-1], [1,1,0], [1,1,1],
    ]

    for(var p=0; p<precisions; p++){
        var currentChunkSize = chunkSize * Math.pow(3, p);
        priorityQueues.push([]);
        for(var l=0; l<updateLocations.length;l++){
            priorityQueues[p].push({
                    type: 'update',
                    location: [updateLocations[l][0]*currentChunkSize + planetLocation[0],
                                updateLocations[l][1]*currentChunkSize + planetLocation[1],
                                updateLocations[l][2]*currentChunkSize + planetLocation[2]],
                    size: currentChunkSize,
                    length: chunkLength
            });
        }
    }


    self.postMessage({
        type: 'result',
        id: self.id,
        data: {
            list: priorityQueues,
            debug: debug
        }
    });

}

self.GenerateUpdateChunkList = function(data){

    //l'emplacement ou commence l'utilisateur, elle peut changé mais au depart...
    planetLocation = data[0];

    //la taille de la plus petite chunk
    chunkSize = data[1];

    //la taille (en unité) ou la précision de la chunk
    chunkLength = data[2];

    //la taille (en unité) ou la précision de la chunk
    precisions= data[3];

    var priorityQueues = [[]];
    for(var i=0; i<precisions; i++){
        priorityQueues.push([]);
    }

    //le nouvel emplacement ainsi que le mouvement
    var movement = data[4];
    var newChunk = data[5];
    var debug = data[6];

    //donc ici 2 choses peuvent se produire, soit qu'on 'collapse' des chunks
    //ou soit qu'on les 'rebuild'. On collapse dans une direction spécifique
    //(ou vers un coin) quand on s'éloigne du centre. Et on rebuild une direction
    //spécifique quand on reviens dans un centre

    //  __ __ __   __ __ __
    // |__|__|__| |        |
    // |__|_-->_| |        |   COLLAPSE à DROITE
    // |__|__|__| |__ __ __|
    //  __ __ __   __ __ __
    // |        | |__|__|__|
    // |        | |_-->_|__|   REBUILD à GAUCHE
    // |__ __ __| |__|__|__|

    //on commence par regarder dans quelle partie du processus on est (build ou collapse)
    //dependament de notre distance avec le centre ainsi que notre déplacement

    var closestCenter = [Math.round(newChunk[0]/3)*3, Math.round(newChunk[1]/3)*3, Math.round(newChunk[2]/3)*3];

    var locationToCenter = [newChunk[0]-closestCenter[0], newChunk[1]-closestCenter[1], newChunk[2]-closestCenter[2]];
    var oldLocationToCenter = [locationToCenter[0]-movement[0], locationToCenter[1]-movement[1], locationToCenter[2]-movement[2]];

    var rebuildVectors = [];
    var collapseVectors = [];

    for(var i=0; i<3; i++){
        if(Math.abs(locationToCenter[i]) == 1 && oldLocationToCenter.indexOf(2) == -1 && oldLocationToCenter.indexOf(-2) == -1 ){
            //on va construire le vecteur
            var newCollapseVector = [0,0,0];
            for(var j=0; j<3; j++){
                if(i==j){
                    newCollapseVector[i] = locationToCenter[i];
                }
            }

            if(newCollapseVector[0] != 0 || newCollapseVector[1]!= 0 || newCollapseVector[2] != 0){
                collapseVectors.push(newCollapseVector);
            }
        }

        if(Math.abs(locationToCenter[i]) == 0 && oldLocationToCenter.indexOf(2) == -1 && oldLocationToCenter.indexOf(-2) == -1 ){
            var newRebuildVector = [0,0,0];
            for(var j=0; j<3; j++){
                if(i==j){
                    newRebuildVector[i] = oldLocationToCenter[i];
                }
            }
            if(newRebuildVector[0] != 0 || newRebuildVector[1]!= 0 || newRebuildVector[2] != 0){
                rebuildVectors.push(newRebuildVector);
            }
        }
    }

    //ensuite ce qu'on va faire c'est créer toute les combinaisons possible de vecteurs resultants

    if(collapseVectors.length == 3){
        collapseVectors.push([collapseVectors[0][0] + collapseVectors[1][0], collapseVectors[0][1] + collapseVectors[1][1], collapseVectors[0][2] + collapseVectors[1][2]])
        collapseVectors.push([collapseVectors[0][0] + collapseVectors[2][0], collapseVectors[0][1] + collapseVectors[2][1], collapseVectors[0][2] + collapseVectors[2][2]])
        collapseVectors.push([collapseVectors[2][0] + collapseVectors[1][0], collapseVectors[2][1] + collapseVectors[1][1], collapseVectors[2][2] + collapseVectors[1][2]])

        collapseVectors.push([collapseVectors[0][0] + collapseVectors[1][0] + collapseVectors[2][0], collapseVectors[0][1] + collapseVectors[1][1] + collapseVectors[2][1], collapseVectors[0][2] + collapseVectors[1][2] + collapseVectors[2][2]])
    }
    if(rebuildVectors.length == 3){
        rebuildVectors.push([rebuildVectors[0][0] + rebuildVectors[1][0], rebuildVectors[0][1] + rebuildVectors[1][1], rebuildVectors[0][2] + rebuildVectors[1][2]])
        rebuildVectors.push([rebuildVectors[0][0] + rebuildVectors[2][0], rebuildVectors[0][1] + rebuildVectors[2][1], rebuildVectors[0][2] + rebuildVectors[2][2]])
        rebuildVectors.push([rebuildVectors[2][0] + rebuildVectors[1][0], rebuildVectors[2][1] + rebuildVectors[1][1], rebuildVectors[2][2] + rebuildVectors[1][2]])

        rebuildVectors.push([rebuildVectors[0][0] + rebuildVectors[1][0] + rebuildVectors[2][0], rebuildVectors[0][1] + rebuildVectors[1][1] + rebuildVectors[2][1], rebuildVectors[0][2] + rebuildVectors[1][2] + rebuildVectors[2][2]])
    }

    if(collapseVectors.length == 2){
        collapseVectors.push([collapseVectors[0][0] + collapseVectors[1][0], collapseVectors[0][1] + collapseVectors[1][1], collapseVectors[0][2] + collapseVectors[1][2]])
    }
    if(rebuildVectors.length == 2){
        rebuildVectors.push([rebuildVectors[0][0] + rebuildVectors[1][0], rebuildVectors[0][1] + rebuildVectors[1][1], rebuildVectors[0][2] + rebuildVectors[1][2]])
    }
/*
    console.log("locationToCenter: " + locationToCenter);
    console.log("oldLocationToCenter: " + oldLocationToCenter);
    console.log("collapseVectors: " + collapseVectors);
    console.log("rebuildVectors: " + rebuildVectors);
*/
    //ensuite, on va finalement generer la liste des chunks à collapse et à rebuild
    var centerChunkLocation = [closestCenter[0] * chunkSize, closestCenter[1] * chunkSize, closestCenter[2] * chunkSize];

    //pour chaque vecteur
    for(var i=0; i< collapseVectors.length; i++){
        //pour chaque precision
        var highestPrecisionChunkLocation = [centerChunkLocation[0]+collapseVectors[i][0]*3*chunkSize, centerChunkLocation[1]+collapseVectors[i][1]*3*chunkSize, centerChunkLocation[2]+collapseVectors[i][2]*3*chunkSize];
        self.addPrioritiesToCollapseChunk(highestPrecisionChunkLocation, chunkSize, chunkLength, planetLocation, priorityQueues, 0);
        for(var j=1; j<precisions; j++){
            var currentChunkSize = chunkSize * Math.pow(3, j);
            var currentLocation = [highestPrecisionChunkLocation[0]+currentChunkSize*2*collapseVectors[i][0],
                        highestPrecisionChunkLocation[1]+currentChunkSize*2*collapseVectors[i][1],
                        highestPrecisionChunkLocation[2]+currentChunkSize*2*collapseVectors[i][2]]
            highestPrecisionChunkLocation = [currentLocation[0], currentLocation[1], currentLocation[2]];
            self.addPrioritiesToCollapseChunk(currentLocation, currentChunkSize, chunkLength, planetLocation, priorityQueues, j);
        }
    }

    //pour chaque vecteur
    for(var i=0; i< rebuildVectors.length; i++){
        //pour chaque precision
        var highestPrecisionChunkLocation = [centerChunkLocation[0]+rebuildVectors[i][0]*3*chunkSize, centerChunkLocation[1]+rebuildVectors[i][1]*3*chunkSize, centerChunkLocation[2]+rebuildVectors[i][2]*3*chunkSize];
        self.addPrioritiesToRebuildChunk(highestPrecisionChunkLocation, chunkSize*3, chunkLength, planetLocation, priorityQueues, precisions);
        for(var j=2; j<=precisions; j++){
            var currentChunkSize = chunkSize * Math.pow(3, j);
            var currentLocation = [highestPrecisionChunkLocation[0]+currentChunkSize*(2/3)*rebuildVectors[i][0],
                        highestPrecisionChunkLocation[1]+currentChunkSize*(2/3)*rebuildVectors[i][1],
                        highestPrecisionChunkLocation[2]+currentChunkSize*(2/3)*rebuildVectors[i][2]]
            highestPrecisionChunkLocation = [currentLocation[0], currentLocation[1], currentLocation[2]];
            if(j == precisions){
                self.addPrioritiesToRebuildChunk(currentLocation, 0, 0, planetLocation, priorityQueues, j+precisions-1);
            }else{
                self.addPrioritiesToRebuildChunk(currentLocation, currentChunkSize, chunkLength, planetLocation, priorityQueues, j+precisions-1);
            }
        }
    }


    self.postMessage({
        type: 'result',
        id: self.id,
        data: {
            list: priorityQueues,
            debug: debug
        }
    });


}

self.addPrioritiesToCollapseChunk = function(chunkLocation, size, chunkLength, planetLocation, priorityList, prio){
    for(var i=-1; i<=1; i++){
        for(var j=-1; j<=1; j++){
            for(var k=-1; k<=1; k++){
                priorityList[prio].push({
                        type: 'update',
                        location: [chunkLocation[0]+i*size + planetLocation[0],
                                    chunkLocation[1]+j*size + planetLocation[1],
                                    chunkLocation[2]+k*size + planetLocation[2]],
                        size: size,
                        length: chunkLength
                });
            }
        }
    }

}
self.addPrioritiesToRebuildChunk = function(chunkLocation, size, chunkLength, planetLocation, priorityList, prio){
    while(priorityList[prio] == null){
        priorityList.push([]);
    }
    priorityList[prio].push({
            type: 'update',
            location: [chunkLocation[0] + planetLocation[0],
                        chunkLocation[1] + planetLocation[1],
                        chunkLocation[2] + planetLocation[2]],
            size: size,
            length: chunkLength
    });

}

self.generateGeometry = function(grid, length, size, chunkCenter, index, compressedData, isMain){

    var profiler = new Profiler();
    //var geo = new THREE.Geometry();
    var vertices = [];
    var faces = [];
    var blockSize = size / length;
    var unit = blockSize;
    var hUnit = unit /2.0;

    for(var x=0; x<length;x++){
        for(var y=0; y<length;y++){
            for(var z=0; z<length;z++){
                var cubeindex = 0;

                var cubeEdges = [];
                cubeEdges[0] = grid[x][y][z];
                cubeEdges[1] = grid[x][y][z+1];
                cubeEdges[2] = grid[x+1][y][z+1];
                cubeEdges[3] = grid[x+1][y][z];
                cubeEdges[4] = grid[x][y+1][z];
                cubeEdges[5] = grid[x][y+1][z+1];
                cubeEdges[6] = grid[x+1][y+1][z+1];
                cubeEdges[7] = grid[x+1][y+1][z];

                if ( cubeEdges[0] != index ) cubeindex |= 1;
                if ( cubeEdges[1] != index  ) cubeindex |= 2;
                if ( cubeEdges[2] != index  ) cubeindex |= 4;
                if ( cubeEdges[3] != index  ) cubeindex |= 8;
                if ( cubeEdges[4] != index  ) cubeindex |= 16;
                if ( cubeEdges[5] != index  ) cubeindex |= 32;
                if ( cubeEdges[6] != index  ) cubeindex |= 64;
                if ( cubeEdges[7] != index  ) cubeindex |= 128;

                var bits = MarchingCube.edgeTable[ cubeindex ];

                // top of the cube

                var vertlist = [];
                            //console.dir(grid);
                //console.dir(cubeindex);
                var tableStartIndex = cubeindex*16;
                var currentTableIndex = tableStartIndex;
                while(MarchingCube.triTable[currentTableIndex] != -1){
                  //on créé les vertex qui seront utilisés pour les polygons
                  //console.log(MarchingCube.triTable[currentTableIndex])
                  if(MarchingCube.triTable[currentTableIndex] == 0){
                    vertices.push([(x*unit), (y*unit), (z*unit)+hUnit]);
                  }else if(MarchingCube.triTable[currentTableIndex] == 1){
                    vertices.push([(x*unit)+hUnit, (y*unit), (z*unit)+unit]);
                  }else if(MarchingCube.triTable[currentTableIndex] == 2){
                    vertices.push([(x*unit)+unit, (y*unit), (z*unit)+hUnit]);
                  }else if(MarchingCube.triTable[currentTableIndex] == 3){
                    vertices.push([(x*unit)+hUnit, (y*unit), (z*unit)]);
                  }else if(MarchingCube.triTable[currentTableIndex] == 4){
                    vertices.push([(x*unit), (y*unit)+unit, (z*unit)+hUnit]);
                  }else if(MarchingCube.triTable[currentTableIndex] == 5){
                    vertices.push([(x*unit)+hUnit, (y*unit)+unit, (z*unit)+unit]);
                  }else if(MarchingCube.triTable[currentTableIndex] == 6){
                    vertices.push([(x*unit)+unit, (y*unit)+unit, (z*unit)+hUnit]);
                  }else if(MarchingCube.triTable[currentTableIndex] == 7){
                    vertices.push([(x*unit)+hUnit, (y*unit)+unit, (z*unit)]);
                  }else if(MarchingCube.triTable[currentTableIndex] == 8){
                    vertices.push([(x*unit), (y*unit)+hUnit, (z*unit)]);
                  }else if(MarchingCube.triTable[currentTableIndex] == 9){
                    vertices.push([(x*unit), (y*unit)+hUnit, (z*unit)+unit]);
                  }else if(MarchingCube.triTable[currentTableIndex] == 10){
                    vertices.push([(x*unit)+unit, (y*unit)+hUnit, (z*unit)+unit]);
                  }else if(MarchingCube.triTable[currentTableIndex] == 11){
                    vertices.push([(x*unit)+unit, (y*unit)+hUnit, (z*unit)]);
                  }

                  var deltaIndex = currentTableIndex - tableStartIndex;
                  if(deltaIndex > 0 && (deltaIndex+1) % 3 == 0){
                    //console.log("push des faces")
                    faces.push([vertices.length-3, vertices.length-2, vertices.length-1]);
                  }

                  currentTableIndex++;
                }

            }
        }
    }

    var color = 0x00BB00;

    if(blockSize < (100/30)+1){
        color =0x00DD00
    }else if(blockSize < 11){
        color =0x0000DD;
    }else{
        color = 0xDD0000;
    }


    if(index != 1){
        color = 0xDD0000;
    }
    profiler.display("Generating Geometry");

    return {
            geo: {
                    vertices: vertices,
                    faces: faces,
                    color: color
            },
            typeIndex: index,
            chunkLocation: chunkCenter,
            compressedChunk: compressedData,
            size: size,
            length: length,
            isMain:isMain
        }
}

self.generateChunk = function(taskData){

        var size = taskData.size;
        var length = taskData.length;
        var chunkCenter = taskData.location
        var planetLocation = taskData.planetLocation;
        var Modifications = taskData.modifications;
        var isMain = taskData.isMain;
        var compressedData = taskData.compressedData;
        var features = taskData.features;
        var debug = taskData.debug;
        var elementRepresentations = [];


        var blockSize = size / length;

        /*self.generateGeometry( self.generateData(size, maxRes, chunkStart, planetLocation), size, blockSize, chunkStart, chunkLocation, 1);
        return;*/
        var data;
        var newData;
        if(isMain){
            //si on est à la plus haute resolution
            if(compressedData != null){
                data = self.uncompressData(compressedData, maxRes);
                newData = self.simpleResolutionForData(data, length);
            }else{
                data = self.generateData(size, length, chunkCenter, isMain, features);
                newData = self.simpleResolutionForData(data, length);
                var compressedData = self.compressData(data);
            }
            for(var i=1; i<5; i++){
                if(newData != null){
                    elementRepresentations.push(self.generateGeometry(newData, length, size, chunkCenter, i, compressedData, isMain));
                }else{
                    elementRepresentations.push(self.generateGeometry([[[]]], length, size, chunkCenter, i,  compressedData, isMain));
                }
            }
        }else{
                data = self.generateData(size, length, chunkCenter, isMain, features);
                for(var i=1; i<5; i++){
                    if(data != null){
                        elementRepresentations.push(self.generateGeometry(data, length, size, chunkCenter, i, null, false));
                    }else{
                        elementRepresentations.push(self.generateGeometry([[[]]], length, size, chunkCenter, i,  null, false));
                    }
                }
        }

        self.postMessage({
                type: 'result',
                id: self.id,
                data : {
                    list: elementRepresentations,
                    debug: debug
                }
        });
        //self.generateGeometry(newData, size, blockSize, chunkStart, chunkLocation, 2, null);
        return;

}

self.generateData = function(size, length, chunkCenter, isMax, features){

    //var chunkLocation = [planetLocation[0]+chunkStart[0]*size+size/2, planetLocation[1]+chunkStart[1]*size+size/2, planetLocation[2]+chunkStart[2]*size+size/2];

    var profiler = new Profiler();

    var blockSize = size / length;
    var halfBlock = (blockSize/2);

    var suppSize = 1;

    //var size = Math.floor(smoothSize / precision);
    var heightMap = [];
    for(var x=0; x<length+suppSize; x++){
        heightMap.push([]);
        for(var z=0; z<length+suppSize; z++){
            heightMap[x].push(GetHeight(chunkCenter[0]+blockSize*(x-(length/2)), chunkCenter[2]+blockSize*(z-(length/2))));
        }
    }

    profiler.display("Creating HeightMap");
    //console.log(heightMap);
    var map = [];
    //console.dir(heightMap);
    var chunkTower=[];
    for(var i = 0; i<length+suppSize; i++){
        map.push([]);
        for(var j = 0; j<length+suppSize; j++){
            var yLoc = chunkCenter[1]+blockSize*(j-(length/2));
            map[i].push([]);
            for(var k = 0; k<length+suppSize; k++){
                //console.log(heightMap[i][k] + " - " )

                if(heightMap[i][k]> yLoc){
                    map[i][j].push(1);
                }else{
                    map[i][j].push(0);
                }

            }
        }
    }

    profiler.display("Creating 3d Array");

    //on va aller generer les données pour ces feature
    for(var i=0; i<features.length; i++){
        if(features[i].maxOnly == false || isMax){
            var functionString = features[i].type + "_GenerateFeatures";
            map = self[functionString](features[i], chunkCenter, length, size, map);
        }

        profiler.display("Adding Features " + features[i].type);
    }

    return map;
}

self.isWithinCave = function(x, y, z){

    var scale = 1;
    //var caveDisplacementX = (PerlinNoise.noise(0.8, 0.8, z/scale)*4)-3;
    //var caveDisplacementY = (PerlinNoise.noise(0.8, 0.8, z/scale)*4)-3;
    //console.log(caveDisplacementY);
    //return (self.OctavePerlin((x/100)+caveDisplacementX, (y/100)+caveDisplacementY, z/100000, 3, 4)<0.30);
    return false;
}

self.changeResolutionForData = function(rawData, oldRes, newRes){
    if(oldRes == newRes){
        return rawData;
    }
    newRes +=1;
    var voxelSize = Math.floor(oldRes / newRes);
    var result = [];

    for(var f=0; f<newRes; f++){
        result.push([]);
        for(var g=0; g<newRes; g++){
            result[f].push([]);
            for(var h=0; h<newRes; h++){
                //on va déterminer quel type de voxel on va mettre

                var voxelCount = [];
                for(var x=-voxelSize; x <= voxelSize; x++){
                    for(var y=-voxelSize; y <= voxelSize; y++){
                        for(var z=-voxelSize; z <= voxelSize; z++){
                            if((f+x)>=0 && (g+y)>=0 && (h+z)>=0 && (f+x)<newRes && (g+y)<newRes && (h+z)<newRes){
                                var value = rawData[(f+x)][(g+y)][(h+z)];
                                if(voxelCount[value] == undefined){
                                    voxelCount[value] = 1;
                                }else{
                                    voxelCount[value]++;
                                }

                            }

                        }
                    }
                }
                result[f][g].push(voxelCount.indexOf(Math.max.apply(Math, voxelCount)));
            }
        }
    }
    if(newRes == 2){
        console.dir(result);
    }
    return result;
    //TOIMPLEMENT
}

self.simpleResolutionForData = function(rawData, newRes){
    return rawData;
    //TODO: à ARRANGER
    if(oldRes == newRes){
        return rawData;
    }
    if(newRes == 0){
        return null;
    }
    newRes;
    oldRes;
    var oldBlockSize = 1/oldRes;
    var newBlockSize = 1/newRes;
    var result = [];

    for(var f=0; f<newRes+1; f++){
        result.push([]);
        for(var g=0; g<newRes+1; g++){
            result[f].push([]);
            for(var h=0; h<newRes+1; h++){
                result[f][g].push([]);
                var lowXBlock = Math.floor((f*newBlockSize)/oldBlockSize);
                var lowXLoc = lowXBlock * oldBlockSize;
                var deltaX = (f*newBlockSize)-lowXLoc;
                var closestX = lowXBlock;
                if(deltaX > (oldBlockSize/2) && (lowXBlock+1) < rawData.length ){
                    closestX = lowXBlock+1;
                }

                var lowYBlock = Math.floor((g*newBlockSize)/oldBlockSize);
                var lowYLoc = lowYBlock * oldBlockSize;
                var deltaY = (g*newBlockSize)-lowYLoc;
                var closestY = lowYBlock;
                if(deltaY > (oldBlockSize/2) && (lowYBlock+1) < rawData.length ){
                    closestY = lowYBlock+1;
                }

                var lowZBlock = Math.floor((h*newBlockSize)/oldBlockSize);
                var lowZLoc = lowZBlock * oldBlockSize;
                var deltaZ = (h*newBlockSize)-lowZLoc;
                var closestZ = lowZBlock;
                if(deltaZ > (oldBlockSize/2) && (lowZBlock+1) < rawData.length ){
                    closestZ = lowZBlock+1;
                }

                result[f][g][h] = rawData[closestX][closestY][closestZ];

            }
        }
    }
    return result;
    //TOIMPLEMENT
}

self.OctavePerlin = function(x, y, z, octaves, persistence){
    var total = 0;
    var frequency = 1;
    var amplitude = 1;
    var maxValue = 0;

    for(var i=0; i<octaves; i++){
        total += PerlinNoise.noise(x * frequency, y * frequency, z * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
    }

    return total /maxValue;
}

GetHeight = function(x, z){
    //var actualx = (this.chunkStartX+(x*precision));
    //var actualz = (this.chunkStartY+(z*precision));
    var scale = 100000;
    return (self.OctavePerlin(x/scale, z/scale, 0.9, 6, 5)*10000)-5000;
    //var scale = 1000;
    //return self.OctavePerlin(x/scale, z/scale, 0.9, 3, 4)*500;
    /*
    var scale = 500;
	var biome1 = PerlinNoise.noise((x/10000)+123456, (z/10000) + 123456, 0.8)*1000;
	var heightMultiplier = PerlinNoise.noise(x/1000, z/1000, 0.5)*500;
    var height = PerlinNoise.noise(x/scale, z/scale, 0.9)*heightMultiplier;
    return height;
    */

}


PerlinNoise = new function () {

    this.noise = function (x, y, z) {

        var p = new Array(512)
        var permutation = [151, 160, 137, 91, 90, 15,
        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
        ];
        for (var i = 0; i < 256 ; i++)
            p[256 + i] = p[i] = permutation[i];

        var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
            Y = Math.floor(y) & 255,                  // CONTAINS POINT.
            Z = Math.floor(z) & 255;
        x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
        y -= Math.floor(y);                                // OF POINT IN CUBE.
        z -= Math.floor(z);
        var u = fade(x),                                // COMPUTE FADE CURVES
               v = fade(y),                                // FOR EACH OF X,Y,Z.
               w = fade(z);
        var A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z,      // HASH COORDINATES OF
            B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;      // THE 8 CUBE CORNERS,

        return scale(lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),  // AND ADD
                                       grad(p[BA], x - 1, y, z)), // BLENDED
                               lerp(u, grad(p[AB], x, y - 1, z),  // RESULTS
                                       grad(p[BB], x - 1, y - 1, z))),// FROM  8
                       lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1),  // CORNERS
                                       grad(p[BA + 1], x - 1, y, z - 1)), // OF CUBE
                               lerp(u, grad(p[AB + 1], x, y - 1, z - 1),
                                       grad(p[BB + 1], x - 1, y - 1, z - 1)))));
    }
    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(t, a, b) { return a + t * (b - a); }
    function grad(hash, x, y, z) {
        var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
        var u = h < 8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
               v = h < 4 ? y : h == 12 || h == 14 ? x : z;
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    }
    function scale(n) { return (1 + n) / 2; }
}
//importScripts("../../external/js/three.min.js");


var MarchingCube = {};
        MarchingCube.edgeTable = new Int32Array([
0x0, 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
0x190, 0x99, 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
0x230, 0x339, 0x33, 0x13a, 0x636, 0x73f, 0x435, 0x53c,
0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
0x3a0, 0x2a9, 0x1a3, 0xaa, 0x7a6, 0x6af, 0x5a5, 0x4ac,
0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
0x460, 0x569, 0x663, 0x76a, 0x66, 0x16f, 0x265, 0x36c,
0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff, 0x3f5, 0x2fc,
0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55, 0x15c,
0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc,
0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
0xcc, 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
0x15c, 0x55, 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
0x2fc, 0x3f5, 0xff, 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
0x36c, 0x265, 0x16f, 0x66, 0x76a, 0x663, 0x569, 0x460,
0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa, 0x1a3, 0x2a9, 0x3a0,
0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33, 0x339, 0x230,
0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99, 0x190,
0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0 ])

MarchingCube.triTable = new Int32Array([
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1,
3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1,
3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1,
3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1,
9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1,
9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1,
8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1,
9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1,
3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1,
1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1,
4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1,
4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1,
2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1,
9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1,
10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1,
4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1,
5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1,
5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1,
9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1,
0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1,
1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1,
10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1,
8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1,
2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1,
7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1,
9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1,
2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1,
11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1,
9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1,
5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1,
11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1,
11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1,
9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1,
5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1,
2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1,
6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1,
0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1,
3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1,
6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1,
6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1,
1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1,
8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1,
7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1,
3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1,
0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1,
9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1,
8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1,
5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1,
0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1,
6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1,
10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1,
10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1,
8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1,
1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1,
0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1,
10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1,
0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1,
3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1,
6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1,
9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1,
8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1,
3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1,
6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1,
0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1,
10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1,
10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1,
1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1,
2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1,
7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1,
7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1,
2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1,
1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1,
11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1,
8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1,
0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1,
7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1,
7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1,
2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1,
1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1,
10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1,
10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1,
0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1,
7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1,
6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1,
8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1,
9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1,
6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1,
4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1,
10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1,
8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1,
0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1,
1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1,
8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1,
10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1,
4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1,
10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1,
9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1,
7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1,
3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1,
7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1,
3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1,
6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1,
9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1,
1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1,
4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1,
7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1,
6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1,
3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1,
0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1,
6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1,
0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1,
11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1,
6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1,
5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1,
9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1,
1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1,
1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1,
10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1,
0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1,
5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1,
10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1,
11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1,
9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1,
7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1,
2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1,
8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1,
9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1,
9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1,
1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1,
9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1,
9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1,
5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1,
0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1,
10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1,
2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1,
0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1,
0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1,
9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1,
5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1,
3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1,
5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1,
8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1,
0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1,
9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1,
1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1,
3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1,
4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1,
9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1,
11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1,
11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1,
2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1,
9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1,
3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1,
1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1,
4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1,
4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1,
0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1,
3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1,
3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1,
0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1,
9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1,
1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ]);
