var Planet = function(size, position){

    var self = this;

    this.ChunkSize = size;
    this.Position = new THREE.Vector3(position[0], position[1], position[2] );

    this.oldxindex = 0;
    this.oldzindex = 0;
    this.oldyindex = 0;

    this.building = [];

    this.Chunks = new Chunks(size, position, [new Caves(0.25, 2.0, 2.0),
                                                /*new Ores(1.0, 4, 0.2, 2),
                                                new Ores(1.1, 5, 0.1, 2),*/
                                                new Ice(1000),
                                                new Water(200)]);

    this.currentHighLightLocation = new THREE.Vector3( 0, 0, 0 );

    this.highlightClosest = function(cameraPosition, lookAtVector){

        var location = new THREE.Vector3(0,0,0);
        location.copy(lookAtVector);
        location.multiplyScalar(10);
        location.add(cameraPosition);

        var blockSize = self.ChunkSize/self.Chunks.ChunkLength;

        var lookAtRelativePosition = new THREE.Vector3(0,0,0);
        var caster = new THREE.Raycaster();
        caster.set(cameraPosition, lookAtVector);
        var collisions = caster.intersectObjects(scene.children);
        var closestCollision = 0;
        for(var i=0; i< collisions.length; i++){
             if (collisions[i].object.name != "cross"){
                 //console.dir(collisions[i]);
                 closestCollision = i;
                 lookAtRelativePosition.copy(collisions[i].point);
                 break;
             }
        }


        var highLightx = Math.round(lookAtRelativePosition.x / blockSize) * blockSize;
        var highLighty = Math.round(lookAtRelativePosition.y / blockSize) * blockSize;
        var highLightz = Math.round(lookAtRelativePosition.z / blockSize) * blockSize;
        //console.log(lookAtRelativePosition);

        if((self.currentHighLightLocation.x != highLightx || self.currentHighLightLocation.y != highLighty || self.currentHighLightLocation.z != highLightz)){
            if(self.highlightMesh != undefined){
                scene.remove(self.highlightMesh);
                self.highlightMesh.geometry.dispose();
                self.highlightMesh.material.dispose();
            }
          	var blockSize = blockSize;
            var material = new THREE.LineBasicMaterial({ color: 0xffffff });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(
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
            //console.log("CROSS: " + location.x+ ", " + location.y + ", " + location.z);
        	block.position.x = highLightx;
        	block.position.y = highLighty;
        	block.position.z = highLightz;
            //console.log("ACTUAL CROSS: " + block.position.x+ ", " + block.position.y + ", " + block.position.z);
            //console.log(block.position);
            block.name = "cross";
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
        //on va faire un 'cube'

        var blockSize = self.ChunkSize/self.Chunks.ChunkLength;
        var location = new THREE.Vector3(self.currentHighLightLocation.x, self.currentHighLightLocation.y, self.currentHighLightLocation.z );
        self.Chunks.replaceVoxel(location, 3, {type: "cube", size: 3});
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
            //self.Chunks.UpdatePhysics([xIndex, yIndex, zIndex]);
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
