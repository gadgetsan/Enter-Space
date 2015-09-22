var Planet = function(size, position){

    var self = this;

    this.ChunkSize = size;
    this.Position = new THREE.Vector3(position[0], position[1], position[2] );

    this.oldxindex = 0;
    this.oldzindex = 0;
    this.oldyindex = 0;

    this.building = [];

    this.Chunks = new Chunks(size, position, [/*new Caves(0.25, 5.0, 5.0),*/
                                                new Ores(1.0, 4, 0.2),
                                                new Ores(1.1, 5, 0.1),
                                                new Ice(1000),
                                                new Water(200)]);

    this.currentHighLightLocation = new THREE.Vector3( 0, 0, 0 );

    this.highlightClosest = function(cameraPosition, lookAtVector){
        //console.log(cameraPosition);
        var blockSize = self.ChunkSize/self.Chunks.ChunkLength;
        var location = new THREE.Vector3(0,0,0);
        location.copy(lookAtVector);
        //location.multiplyScalar(blockSize*2);
        //location.add(cameraPosition);

        var lookAtRelativePosition = location;
        var caster = new THREE.Raycaster();
        caster.set(cameraPosition, lookAtVector);
        var collisions = caster.intersectObjects(scene.children);
        var looookAT = new THREE.Vector3(0,0,0);
         if (collisions.length > 0){
             lookAtRelativePosition = collisions[0].point.sub(self.Position);
             looookAT =collisions[0].point;
         }

        var highLightx = blockSize * Math.round(lookAtRelativePosition.x / blockSize);
        var highLighty = blockSize * Math.round(lookAtRelativePosition.y / blockSize);
        var highLightz = blockSize * Math.round(lookAtRelativePosition.z / blockSize);
        //console.log(lookAtRelativePosition);

        if((self.currentHighLightLocation.x != highLightx || self.currentHighLightLocation.y != highLighty || self.currentHighLightLocation.z != highLightz)){
            if(self.highlightMesh != undefined){
                scene.remove(self.highlightMesh);
            }
          	var blockSize = blockSize;
            var material = new THREE.LineBasicMaterial({ color: 0xffffff });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(
            	new THREE.Vector3( -lookAtVector.x, -lookAtVector.y, -lookAtVector.z ),
            	new THREE.Vector3( 0, 0, 0 ),
            	new THREE.Vector3( 0, blockSize, 0 ),
            	new THREE.Vector3( 0, -blockSize, 0 ),
            	new THREE.Vector3( 0, 0, 0 ),
            	new THREE.Vector3(blockSize, 0, 0 ),
            	new THREE.Vector3(-blockSize, 0, 0 ),
            	new THREE.Vector3( 0, 0, 0 ),
            	new THREE.Vector3(0, 0, blockSize),
            	new THREE.Vector3(0, 0, -blockSize)
            );
        	var block = new THREE.Line( geometry, material);
        	block.position.x = highLightx+self.Position.x;
        	block.position.y = highLighty+self.Position.y;
        	block.position.z = highLightz+self.Position.z;
            //console.log(block.position);
        	scene.add(block);
            self.highlightMesh = block;
        }

        self.currentHighLightLocation.x = highLightx;
        self.currentHighLightLocation.y = highLighty;
        self.currentHighLightLocation.z = highLightz;

    }

    this.removeClosest = function(){
            self.Chunks.replaceVoxel(self.currentHighLightLocation, 0)
    }

    this.addClosest = function(){
            self.Chunks.replaceVoxel(self.currentHighLightLocation, 1)
    }

    this.removeAtLocation = function(camera){
            var cameraRelativePosition = camera.position.sub(this.Position);
            var blockSize = chunkSize/this.lowResolutionBlockSize;
            for(var i=1; i<3; i++){
                for(var j=0; j<100; j++){
                    for(var k=1; k<3; k++){
                        this.ChunkGen.modifyChunk(cameraRelativePosition.x+(i * blockSize), cameraRelativePosition.y+(j * blockSize), cameraRelativePosition.z + (k * blockSize), blockSize, 2);
                    }
                }
            }
            var xIndex = Math.floor(cameraRelativePosition.x / this.ChunkSize);
            var zIndex = Math.floor(cameraRelativePosition.z / this.ChunkSize);
            var yIndex = Math.floor(cameraRelativePosition.y / this.ChunkSize);
            this.ChunkGen.UpdateChunk([xIndex, yIndex, zIndex], this.ChunkSize, this.highResolutionBlockSize);
            return camera.position;
    }

    this.Update = function(scene, camera, deltaTime){
        self.Chunks.updateDebugMeshes(deltaTime);
        //this.ChunkGen.UpdateLocation(newChunk, direction);
        //var cameraRelativePosition = camera.position.sub(this.Position);
        var cameraPosition = new THREE.Vector3();
        cameraPosition.copy(camera.position);
        //console.log(cameraPosition);
        cameraPosition.sub(this.Position);
        var halfChunk = this.ChunkSize;
        var xIndex = Math.round(cameraPosition.x / this.ChunkSize);
        var zIndex = Math.round(cameraPosition.z / this.ChunkSize);
        var yIndex = Math.round(cameraPosition.y / this.ChunkSize);
        if((this.oldxindex != xIndex || this.oldyindex != yIndex || this.oldzindex != zIndex)){
            //console.log("new: " + xIndex + ", " + yIndex + ", " + zIndex);
            self.Chunks.UpdatePhysics([xIndex, yIndex, zIndex]);
            self.Chunks.UpdateLocation([xIndex, yIndex, zIndex], [-this.oldxindex + xIndex, -this.oldyindex + yIndex, -this.oldzindex + zIndex]);
        }
        this.oldxindex = xIndex;
        this.oldzindex = zIndex;
        this.oldyindex = yIndex;
    }

    this.collectClosestOfType = function(type, maxDistance){
        //TODO: Implement
        //on va aller chercher le plus près d'un certain type et l'enlever
    }

    this.build = function(){
        var blockSize = self.ChunkSize/self.Chunks.GetMaxRes();
        var geometry = new THREE.BoxGeometry( blockSize, blockSize, blockSize );
        var material = new THREE.MeshBasicMaterial( { color: 0x8800ff } );
        var cube = new THREE.Mesh( geometry, material );
        cube.position.x = self.currentHighLightLocation.x+self.Position.x;
        cube.position.y = self.currentHighLightLocation.y+self.Position.y;
        cube.position.z = self.currentHighLightLocation.z+self.Position.z;
        console.log(cube.position);
        console.log(self.Position);
        scene.add( cube );

        this.building.push({
            mesh: cube,
            building: new FACTORY.Retriever(cube.position)
        })
        return true;
    }

}
/*
    this.changeResolution = function(xIndex, yIndex, zIndex, newResolution){
        var self = this;
        //console.dir(this.Chunks);
        var newChunk = self.Chunks[xIndex][zIndex][yIndex];
        //on va changer la resolution de la nouvelle chunk
        //newChunk.material.color.setHex(0xff0000);
        var newMapTower = self.ChunksData[xIndex][zIndex].GetMap(newResolution, function(newMapTower){
            //console.dir(newMapTower);
            var newMap = newMapTower[yIndex];
            //console.dir(newMap);
            //var newGeometry = MarchingCube.buildChunkGeometry(newMap, this.ChunkSize+newResolution);
            var workerIndex = Workers.Add('MarchingCube', [newMap, self.ChunkSize+newResolution], function(result){
                //console.dir(newGeometry);
                //on doit reconstruire la geometrie parce que les fonctione ne sont pas donné par le thread
                var newGeometry = new THREE.Geometry();
                for (var i = 0; i < result.vertices.length; i++) {
                    newGeometry.vertices.push(new THREE.Vector3(result.vertices[i][0], result.vertices[i][1], result.vertices[i][2]))
                }
                for (var i = 0; i < result.faces.length; i++) {
                    newGeometry.faces.push(new THREE.Face3(result.faces[i][0], result.faces[i][1], result.faces[i][2]))
                }
                //newGeometry.faces = result.faces;
                newGeometry.computeFaceNormals();
                var color = 0x00BB00;
                if(newResolution == 1){
                    color = 0x0000BB;
                }
                var newMesh = {};
                if(newGeometry.faces.length > 0){
                    newMesh = new Physijs.ConcaveMesh(newGeometry, new THREE.MeshLambertMaterial({color: color}), 0, 50, 50);
                }else{
                    console.log("Chunk " + xIndex + ", " + yIndex + ", " + zIndex + " is empty or undefined");
                    newMesh.empty = true;
                    newMesh.position = {};
                }
                newMesh.position.x = newChunk.position.x;
                newMesh.position.y = newChunk.position.y;
                newMesh.position.z = newChunk.position.z;
                if(!newChunk.empty && newChunk.geometry.faces.length > 0){
                    //console.log(newChunk._physijs.id);
                    scene.remove(newChunk);
                    //console.dir(newChunk);
                    //newChunk.dispose();
                }else{
                    //console.log("Chunk " + xIndex + ", " + yIndex + ", " + zIndex + " is empty or undefined");
                    //console.dir(newChunk);
                }

                if(!newMesh.empty){
                    scene.add(newMesh);
                }
                self.Chunks[xIndex][zIndex][yIndex] = newMesh;
            });
        });

    }

}
*/
