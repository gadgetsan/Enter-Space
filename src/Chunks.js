var Chunks = function(chunkSize, startingLocation, features){
    var self = this;
    this.List = [];

    this.Meshes = [];
    this.Bodies = [];
    this.debugMeshes = [];

    //this.resolutions = [15/*, 10, 2*/];//[30, 10, 2];
    //this.distances = [2/*, 5, 20*/];//[2, 5, 20];

    this.ChunkLength = 30;
    this.ChunkSize = chunkSize;
    this.Precisions = 2;

    this.planetLocation = startingLocation;//[100, 100, 100];
    //console.log(startingLocation);

    this.debug = false;

    this.features = features;

    this.elementMaterials = [];
    if(self.debug){
        this.elementMaterials.push(new THREE.MeshBasicMaterial({color: 0x00DD00, opacity: 1.0, transparent: false, wireframe: true }));
        this.elementMaterials.push(new THREE.MeshBasicMaterial({color: 0x33DDFF, opacity: 1.0, transparent: false, wireframe: true  }));
        this.elementMaterials.push(new THREE.MeshBasicMaterial({color: 0xFFFFFF, opacity: 1.0, transparent: false, wireframe: true  }));
        this.elementMaterials.push(new THREE.MeshBasicMaterial({color: 0xFF0000, opacity: 1.0, transparent: false, wireframe: true  }));
        this.elementMaterials.push(new THREE.MeshBasicMaterial({color: 0x00FFFF, opacity: 1.0, transparent: false, wireframe: true  }));
    }else{
        this.elementMaterials.push(new THREE.MeshLambertMaterial({color: 0x00DD00, opacity: 1.0, transparent: false }));
        this.elementMaterials.push(new THREE.MeshLambertMaterial({color: 0x88DDFF, opacity: 1.0, transparent: false }));
        this.elementMaterials.push(new THREE.MeshLambertMaterial({color: 0xFFFFFF, opacity: 1.0, transparent: false }));
        this.elementMaterials.push(new THREE.MeshLambertMaterial({color: 0xFF0000, opacity: 1.0, transparent: false }));
        this.elementMaterials.push(new THREE.MeshLambertMaterial({color: 0x00FFFF, opacity: 1.0, transparent: false }));
    }

    Workers.addTask('GenerateInitialChunkList', [self.planetLocation, self.ChunkSize, self.ChunkLength, self.Precisions], 0, function(result){
        var tasksCount = 0;
        //console.dir(result);
        for(var i=0; i<result.length;i++){
            for(var j=0; j<result[i].length;j++){
                params = {
                    size: result[i][j].size,
                    length: result[i][j].length,
                    location: result[i][j].location,
                    planetLocation: self.planetLocation,
                    isMain: i==0,
                    features: self.features,
                    compressedData: null
                }
                //console.log("Asking to Generate Chunk "+ result[i][j].location + " with priority " + i + " and size: " + result[i][j].size);
                tasksCount++;
                Workers.addTask('generateChunk', params, i, self.UpdateChunk);
            }
        }
        console.log("Starting Tasks: " + tasksCount + " more tasks");
    })




    self.Get = function(index){
        //une simple methode permettant d'obtenir une version compressée des données
        if(self.List[index[0]] != undefined && self.List[index[0]][index[1]] != undefined  ){
            return self.List[index[0]][index[1]][index[2]];
        }else{
            return null;
        }
    }

    self.Set = function(index, compressedData){
        if(self.List[index[0]] == undefined){
            self.List[index[0]] = [];
        }
        if(self.List[index[0]][index[1]] == undefined){
            self.List[index[0]][index[1]] = [];
        }
        self.List[index[0]][index[1]][index[2]] = compressedData;
    }

    self.Get = function(index){
        if(self.List[index[0]] == undefined){
            return null;
        }
        if(self.List[index[0]][index[1]] == undefined){
            return null;
        }
        return self.List[index[0]][index[1]][index[2]];
    }

    self.Refresh = function(index){
        //Une methode permettant de mettre à jour l'Affichage de cette Chunk
    }

    self.Load = function(){
        //À IMPLEMENTER
        var openRequest = indexedDB.open("EnterSpace_v1",1);
        openRequest.onupgradeneeded = function(e) {
            var thisDB = e.target.result;
            console.log("upgradeneeded");
            if(!thisDB.objectStoreNames.contains("Chunks")) {
                var objectStore = thisDB.createObjectStore("Chunks", { keyPath: "Index" });
                objectStore.createIndex("Index","Index", {unique:true});
            }
        }

        openRequest.onsuccess = function(e) {
            db = e.target.result;
            //on va commencer par aller voir si il y a deja quelque chose
            var transaction = db.transaction(["Chunks"],"readonly");
            var store = transaction.objectStore("Chunks");
            var ob = store.get("Chunks");

            ob.onsuccess = function(e) {
                var result = e.target.result;

                if(result){
                    self.List = result.data;
                }
            }


        }

        openRequest.onerror = function(e) {
            console.log("Error");
            console.dir(e);
        }
        return true;
    }

    self.Save = function(){
        var openRequest = indexedDB.open("EnterSpace_v1",1);
        openRequest.onupgradeneeded = function(e) {
            var thisDB = e.target.result;
            console.log("upgradeneeded");
            if(!thisDB.objectStoreNames.contains("Chunks")) {
                var objectStore = thisDB.createObjectStore("Chunks", { keyPath: "Index" });
                objectStore.createIndex("Index","Index", {unique:true});
            }
        }

        openRequest.onsuccess = function(e) {
            db = e.target.result;
            //on va commencer par aller voir si il y a deja quelque chose

            //on doit enregistré nos données
            //console.log("Success!");
            var newTransaction = db.transaction(["Chunks"],"readwrite");
            var newStore = newTransaction.objectStore("Chunks");
            var chunks = {
                Index:"Chunks",
                data:self.List,
            }
            var request = newStore.put(chunks);
            request.onerror = function(e) {
                console.dir(e.target.error);
                //some type of error handler
            }

        }

        openRequest.onerror = function(e) {
            console.log("Error");
            console.dir(e);
        }
        return true;
    }

    self.UpdateChunk = function(result){
        //la différence avec updateMesh c'est que ceci va appeller UpdateMesh pour chaque
        //type d'elements
        var location;
        var isMain;
        for(var i=0; i<result.length; i++){
            self.UpdateMesh(result[i]);
        }

/*
        for(var i=0; i<result.length; i++){

            var BOX;
            var opacity = 0.025;
            if(result[i].isMain){
                BOX = new THREE.Mesh( new THREE.BoxGeometry(result[i].size, result[i].size, result[i].size ), new THREE.MeshLambertMaterial({color: 0x0000FF, opacity: opacity, transparent: true }));
            }else{
                BOX = new THREE.Mesh( new THREE.BoxGeometry(result[i].size, result[i].size, result[i].size ), new THREE.MeshLambertMaterial({color: 0xFF0000, opacity: opacity, transparent: true }));
            }

            BOX.material.side = THREE.DoubleSide;
            BOX.position.set(result[i].chunkLocation[0], result[i].chunkLocation[1], result[i].chunkLocation[2]);
            //console.log(BOX.position);
            scene.add(BOX);
        }
*/


    }

    self.UpdateMesh = function(result){
        //console.dir(result)
        var rawGeometry = result.geo;
        //le centre de la chunk
        var location = result.chunkLocation;
        var typeIndex = result.typeIndex;
        var size = result.size;
        var length = result.length;
        var isMain = result.isMain;

        var actualLocation = [];
        actualLocation[0] = location[0] - (size/2);
        actualLocation[1] = location[1] - (size/2);
        actualLocation[2] = location[2] - (size/2);

        //on va commencer par aller voir si cette chunk va cacher une autre chunk

                for(var i=0; i<self.Meshes.length; i++){
                    var mp = self.Meshes[i].position;
                    //console.log(location + " size: "+size+ "self.Meshes.");
                    if(self.Meshes[i].typeIndex == typeIndex && mp.x > actualLocation[0]-(size/2) && mp.x < actualLocation[0]+(size/2) && mp.y > actualLocation[1]-(size/2) && mp.y < actualLocation[1]+(size/2) && mp.z > actualLocation[2]-(size/2) && mp.z < actualLocation[2]+(size/2)){
                        //if((mp.x - actualLocation[0] > 0.001) && (mp.y - actualLocation[1] > 0.001) && (mp.z - actualLocation[2] > 0.001)){
                            scene.remove(self.Meshes[i]);
                            console.log("removing mesh " + i + " because "+ mp.x + ", " +mp.y + ", " + mp.z+ " is within "+ actualLocation + " at size " + size);
                            //world.remove(self.Bodies[i]);
                            self.Meshes.splice(i, 1);
                            i--;
                        //}
                    }
                }

        if(rawGeometry.faces.length > 1 ){
/*
            console.log(location);
            console.log(size);
            console.log(rawGeometry.faces.length);
            console.log(typeIndex);
*/
            var newGeometry = new THREE.Geometry();
            for (var i = 0; i < rawGeometry.vertices.length; i++) {
                newGeometry.vertices.push(new THREE.Vector3(rawGeometry.vertices[i][0], rawGeometry.vertices[i][1], rawGeometry.vertices[i][2]))
            }
            for (var i = 0; i < rawGeometry.faces.length; i++) {
                newGeometry.faces.push(new THREE.Face3(rawGeometry.faces[i][0], rawGeometry.faces[i][1], rawGeometry.faces[i][2]))
            }
            newGeometry.computeFaceNormals();
            //newGeometry.computeVertexNormals();

            var newMesh = new THREE.Mesh(newGeometry, self.elementMaterials[typeIndex-1] );
            //var newMesh = new THREE.Mesh( new THREE.BoxGeometry(size, size, size ), new THREE.MeshLambertMaterial({color: 0x0000FF, opacity: 0.2, transparent: true }));
            //newMesh.material.side = THREE.DoubleSide;
            newMesh.position.x = actualLocation[0];
            newMesh.position.y = actualLocation[1];
            newMesh.position.z = actualLocation[2];
            newMesh.typeIndex = typeIndex;
            newMesh.castShadow = true;
            newMesh.receiveShadow = true;

            var indices = [];
            for(var i=0; i<rawGeometry.faces.length;i++ ){
                indices.push(rawGeometry.faces[i][0]);
                indices.push(rawGeometry.faces[i][1]);
                indices.push(rawGeometry.faces[i][2]);
            }
            var vertices = [];
            for(var i=0; i<rawGeometry.vertices.length;i++){
                vertices.push(rawGeometry.vertices[i][0]);
                vertices.push(rawGeometry.vertices[i][1]);
                vertices.push(rawGeometry.vertices[i][2]);
            }
            var newBody = null;
			if(isMain){

                var newShape = new CANNON.Trimesh(vertices, indices);
                //newShape.computeNormal();

				newBody = new CANNON.Body({
				   mass: 0, // kg
				   position: new CANNON.Vec3(newMesh.position.x, newMesh.position.y, newMesh.position.z), // m
				   shape: newShape,
                   material: ground_ground_cm
				});
				world.addBody(newBody);
			}


            self.Bodies.push(newBody);
            self.Meshes.push(newMesh);
            //console.log("adding chunk at " + location + " of size "+ size + " isMain? "+ isMain);
            scene.add(newMesh);
        }

    }

    self.UpdateLocation = function(chunkLocation, movement){
        console.log(movement);
        console.log(chunkLocation);
        Workers.addTask('GenerateUpdateChunkList', [self.planetLocation, self.ChunkSize, self.ChunkLength, self.Precisions, movement, chunkLocation], 0, function(result){
            var tasksCount = 0;
            console.dir(result);
            for(var i=0; i<result.length;i++){
                for(var j=0; j<result[i].length;j++){
                    params = {
                        size: result[i][j].size,
                        length: result[i][j].length,
                        location: result[i][j].location,
                        planetLocation: self.planetLocation,
                        isMain: i==0,
                        features: self.features,
                        compressedData: null
                    }
                    //console.log("Asking to Generate Chunk "+ result[i][j].location + " with priority " + i);
                    tasksCount++;
                    //on doit enlever les tâches qui ont deja affaire à modifier cette chunk
                    /*
                    Workers.removeTask(function(task){
                        return (task.location != undefined && task.location[0] == location[0] && task.location[1] == location[1] && task.location[2] == location[2]);
                    })
                    */
                    Workers.addTask('generateChunk', params, i, self.UpdateChunk);
                }
            }
            //on enleve les duplicata;
            Workers.cleanTasks();
            //console.log("newLocation: "+ chunkLocation + " - Movement: " + movement);
            console.log("Update Tasks: " + tasksCount + " more tasks");
        });
    }

    self.replaceVoxel = function(voxelLocation, newValue){
        return;
        //TODO: FIX;
        //on va commencer par aller chercher le chunk contenant le Voxel
        //l'emplacement reçu en parametre est deja relatif

        var chunkLocation = [Math.floor(voxelLocation.x / self.ChunkSize), Math.floor(voxelLocation.y / self.ChunkSize), Math.floor(voxelLocation.z / self.ChunkSize)];
        var voxelSize = self.ChunkSize / self.resolutions[0];
        var voxelRelativeLocation = [Math.floor((voxelLocation.x- chunkLocation[0]*self.ChunkSize)/voxelSize),
                                        Math.floor((voxelLocation.y- chunkLocation[1]*self.ChunkSize)/voxelSize),
                                        Math.floor((voxelLocation.z- chunkLocation[2]*self.ChunkSize)/voxelSize)];
/*
        console.log(chunkLocation);
        console.log(voxelRelativeLocation);
        console.dir(self.Get(chunkLocation));
*/
        params = {
            chunksSize: self.ChunkSize,
            length: self.resolutions[0],
            location: chunkLocation,
            planetLocation: self.planetLocation,
            maxResolution: self.resolutions[0],
            compressedData: self.Get(chunkLocation),
            voxelLocation: voxelRelativeLocation,
            features: self.features,
            newValue: newValue
        }
        Workers.addTask('ChangeVoxel', params, 0, self.UpdateChunk);
        //console.log(voxelRelativeLocation);
        //console.log(chunkLocation);

        //a cause de la manière dont les chunks sont calculés, on veut aussi updater celles qui sont proche si on est pres d'une limite
        for(var i=0; i<3;i++){
            if(voxelRelativeLocation[i] == 0){
                //console.log("updating below " + i);
                var newVoxelLocation = [voxelRelativeLocation[0], voxelRelativeLocation[1], voxelRelativeLocation[2]];
                newVoxelLocation[i] = self.resolutions[0];
                var newChunkLocation = [chunkLocation[0], chunkLocation[1], chunkLocation[2]];
                newChunkLocation[i] = chunkLocation[i]-1
                var newParams = {
                    chunksSize: self.ChunkSize,
                    length: self.resolutions[0],
                    location: newChunkLocation,
                    planetLocation: self.planetLocation,
                    maxResolution: self.resolutions[0],
                    compressedData: self.Get(newChunkLocation),
                    voxelLocation: newVoxelLocation,
                    features: self.features,
                    newValue: newValue
                }
                Workers.addTask('ChangeVoxel', newParams, 0, self.UpdateChunk);
            }else if(voxelRelativeLocation[i] == self.resolutions[0]){
                //console.log("updating above " + i);
                var newVoxelLocation = [voxelRelativeLocation[0], voxelRelativeLocation[1], voxelRelativeLocation[2]];
                newVoxelLocation[i] = 0;
                var newChunkLocation = [chunkLocation[0], chunkLocation[1], chunkLocation[2]];
                newChunkLocation[i] = chunkLocation[i]+1
                var newParams = {
                    chunksSize: self.ChunkSize,
                    length: self.resolutions[0],
                    location: newChunkLocation,
                    planetLocation: self.planetLocation,
                    maxResolution: self.resolutions[0],
                    compressedData: self.Get(newChunkLocation),
                    voxelLocation: newVoxelLocation,
                    features: self.features,
                    newValue: newValue
                }
                Workers.addTask('ChangeVoxel', newParams, 0, self.UpdateChunk);
            }
        }

    }


    //self.Load();
}
