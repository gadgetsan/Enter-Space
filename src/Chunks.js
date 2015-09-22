var Chunks = function(chunkSize, startingLocation, features){
    var self = this;
    this.List = [];

    this.Meshes = [];
    this.currentBody = null;
    this.debugMeshes = [];

    //this.resolutions = [15/*, 10, 2*/];//[30, 10, 2];
    //this.distances = [2/*, 5, 20*/];//[2, 5, 20];

    this.ChunkLength = 35;
    this.ChunkSize = chunkSize;
    this.Precisions = 4;//4;

    this.planetLocation = startingLocation;//[100, 100, 100];
    //console.log(startingLocation);

    this.features = features;

    this.elementMaterials = [];
    this.elementMaterials.push(new THREE.MeshLambertMaterial({color: 0x00DD00, opacity: 1.0, transparent: false }));
    this.elementMaterials.push(new THREE.MeshLambertMaterial({color: 0x88DDFF, opacity: 1.0, transparent: false }));
    this.elementMaterials.push(new THREE.MeshLambertMaterial({color: 0xFFFFFF, opacity: 1.0, transparent: false }));
    this.elementMaterials.push(new THREE.MeshLambertMaterial({color: 0xFF0000, opacity: 1.0, transparent: false }));
    this.elementMaterials.push(new THREE.MeshLambertMaterial({color: 0x00FFFF, opacity: 1.0, transparent: false }));

    Workers.addTask('GenerateInitialChunkList', [self.planetLocation, self.ChunkSize, self.ChunkLength, self.Precisions, {startTime: new Date().getTime(), type: "start"}], 0, function(result){
        var tasksCount = 0;
        //console.dir(queue);
        var queue = result.list;
        for(var i=0; i<queue.length;i++){
            for(var j=0; j<queue[i].length;j++){
                params = {
                    size: queue[i][j].size,
                    length: queue[i][j].length,
                    location: queue[i][j].location,
                    planetLocation: self.planetLocation,
                    isMain: i==0,
                    features: self.features,
                    compressedData: self.Get(queue[i][j].location),
                    debug: result.debug
                }
                //console.log("Asking to Generate Chunk "+ queue[i][j].location + " with priority " + i + " and size: " + queue[i][j].size);
                tasksCount++;
                Workers.addTask('generateChunk', params, i, self.UpdateChunk);
            }
        }
        console.log("Starting Tasks: " + tasksCount + " more tasks");
    })


    self.updateDebugMeshes = function(delta){
        if(!DEBUG){return;}
        for(var i=0; i<self.debugMeshes.length; i++){
            self.debugMeshes[i].ttl -= delta;
            self.debugMeshes[i].material.opacity /= 1.1;
            //console.log(self.debugMeshes[i].ttl);
            if(self.debugMeshes[i].ttl < 0){
                scene.remove(self.debugMeshes[i]);

                self.debugMeshes.splice(i, 1);
                i--;

            }
        }
    }

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
        var queue = result.list;
        for(var i=0; i<queue.length; i++){
            queue[i].debug = result.debug;
            self.UpdateMesh(queue[i]);
        }

        if(DEBUG){

            for(var i=0; i<queue.length; i++){

                var opacity = 1.0;
                var material;
                if(queue[i].isMain){
                    material = new THREE.MeshBasicMaterial({color: 0x0000FF, opacity: opacity, transparent: true });
                }else{
                    material = new THREE.MeshBasicMaterial({color: 0xFF0000, opacity: opacity, transparent: true });
                }
                var debugBox = new THREE.Mesh( new THREE.BoxGeometry(queue[i].size, queue[i].size, queue[i].size ), material);

                debugBox.material.side = THREE.DoubleSide;
                debugBox.position.set(queue[i].chunkLocation[0], queue[i].chunkLocation[1], queue[i].chunkLocation[2]);
                //console.log(BOX.position);
                debugBox.ttl = 5;
                scene.add(debugBox);
                self.debugMeshes.push(debugBox);
            }
        }



    }

    self.UpdateMesh = function(result){
        var profiler = new Profiler();
        var startTime = new Date().getTime();
        //console.dir(result)
        var rawGeometry = result.geo;
        //le centre de la chunk
        var location = result.chunkLocation;
        var typeIndex = result.typeIndex;
        var size = result.size;
        var length = result.length;
        var isMain = result.isMain;
        var compressedData = result.compressedChunk;
        if(compressedData != null){
            self.Set(location, compressedData);
        }

        var actualLocation = [];
        actualLocation[0] = location[0] - (size/2);
        actualLocation[1] = location[1] - (size/2);
        actualLocation[2] = location[2] - (size/2);

        //on va commencer par aller voir si cette chunk va cacher une autre chunk

                for(var i=0; i<self.Meshes.length; i++){
                    var mp = [self.Meshes[i].position.x+self.Meshes[i].size/2, self.Meshes[i].position.y+self.Meshes[i].size/2, self.Meshes[i].position.z+self.Meshes[i].size/2];
                    //console.log(location + " size: "+size+ "self.Meshes.");
                    if(self.Meshes[i].typeIndex == typeIndex &&
                            mp[0] > location[0]-(size/2) && mp[0] < location[0]+(size/2) &&
                            mp[1] > location[1]-(size/2) && mp[1]< location[1]+(size/2) &&
                            mp[2] > location[2]-(size/2) && mp[2]< location[2]+(size/2)){
                            scene.remove(self.Meshes[i]);
                            self.Meshes.splice(i, 1);
                            i--;
                        //}
                    }
                }

        profiler.display("Deleting Older Meshes");
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

            profiler.display("Recreating Geometries");
            newGeometry.computeFaceNormals();
            //newGeometry.computeVertexNormals();

            var material = self.elementMaterials[typeIndex-1];
            var newMesh = new THREE.Mesh(newGeometry, material );
            //var newMesh = new THREE.Mesh( new THREE.BoxGeometry(size, size, size ), new THREE.MeshLambertMaterial({color: 0x0000FF, opacity: 0.2, transparent: true }));
            //newMesh.material.side = THREE.DoubleSide;
            newMesh.position.x = actualLocation[0];
            newMesh.position.y = actualLocation[1];
            newMesh.position.z = actualLocation[2];
            newMesh.typeIndex = typeIndex;
            newMesh.size = size
            newMesh.castShadow = true;
            newMesh.receiveShadow = true;
            profiler.display("Recreating Meshes");


            self.Meshes.push(newMesh);
            //console.log("adding chunk at " + location + " of size "+ size + " isMain? "+ isMain);
            scene.add(newMesh);

            profiler.display("Adding Meshes");
        }
        var endTime = new Date().getTime();


    }

    self.UpdatePhysics = function(newChunkLocation){
        //on va transformer la position reçu en position ultime
        var chunkAbsLocation = [self.planetLocation[0] + (self.ChunkSize * newChunkLocation[0] - self.ChunkSize/2),
                                        self.planetLocation[1] + (self.ChunkSize * newChunkLocation[1]) - self.ChunkSize/2,
                                        self.planetLocation[2] + (self.ChunkSize * newChunkLocation[2]) - self.ChunkSize/2]

        for(var i=0; i<self.Meshes.length; i++){
            var mp = [self.Meshes[i].position.x, self.Meshes[i].position.y, self.Meshes[i].position.z];
            //console.log(location + " size: "+size+ "self.Meshes.");
            if(self.Meshes[i].size == self.ChunkSize && mp[0] == chunkAbsLocation[0] && mp[1] == chunkAbsLocation[1] && mp[2] == chunkAbsLocation[2]){

                var meshGeometry = self.Meshes[i].geometry;
                var meshIndex = self.Meshes[i].typeIndex;

                var indices = [];
                for(var j=0; j<meshGeometry.faces.length;j++ ){
                    indices.push(meshGeometry.faces[j].a);
                    indices.push(meshGeometry.faces[j].b);
                    indices.push(meshGeometry.faces[j].c);
                }
                var vertices = [];
                for(var j=0; j<meshGeometry.vertices.length;j++){
                    vertices.push(meshGeometry.vertices[j].x);
                    vertices.push(meshGeometry.vertices[j].y);
                    vertices.push(meshGeometry.vertices[j].z);
                }

                var newShape = new CANNON.Trimesh(vertices, indices);
                //newShape.computeNormal();


				var newBody = new CANNON.Body({
				   mass: 0, // kg
				   position: new CANNON.Vec3(chunkAbsLocation[0], chunkAbsLocation[1], chunkAbsLocation[2]), // m
				   shape: newShape,
                   material: ground_ground_cm
				});

                if(DEBUG)console.log("----------------------Adding Physics for " + chunkAbsLocation + " faces: " + indices.length + " at " + newBody.position + " for type " + meshIndex);
				world.addBody(newBody);

                if(self.currentBody != null){
                    world.remove(self.currentBody);
                    delete self.currentBody;
                }
                self.currentBody = newBody;
            }
        }
    }

    self.UpdateLocation = function(chunkLocation, movement){
        /*
        console.log(movement);
        console.log(chunkLocation);
        */
        var centerChunkLocation = [chunkLocation[0] * self.ChunkSize+ self.planetLocation[0], chunkLocation[1] * self.ChunkSize + self.planetLocation[1], chunkLocation[2] * self.ChunkSize+ self.planetLocation[2]]
        Workers.addTask('GenerateUpdateChunkList', [self.planetLocation, self.ChunkSize, self.ChunkLength, self.Precisions, movement, chunkLocation, {startTime: new Date().getTime(), type: "update"}], 0, function(result){
            var tasksCount = 0;
            //console.dir(result);
            var queue = result.list;
            for(var i=0; i<queue.length;i++){
                for(var j=0; j<queue[i].length;j++){
                    params = {
                        size: queue[i][j].size,
                        length: queue[i][j].length,
                        location: queue[i][j].location,
                        planetLocation: self.planetLocation,
                        isMain: i==0,
                        features: self.features,
                        compressedData: self.Get(queue[i][j].location),
                        debugData : result.debug
                    }

                    if(DEBUG)console.log("for location "+ centerChunkLocation + " Asking to Generate Chunk "+ queue[i][j].location + " with priority " + i + " and size " + queue[i][j].size);
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


    self.Load();
}
