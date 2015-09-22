
var WorkersManager = function(){
    self = this;
    self.threadsNum = navigator.hardwareConcurrency-1;
    self.Workers = [];
    self.Callbacks = [];
    self.WorkerActivity = [];
    self.workPiles = [[], [], [], [], []];

    var workerCallback = function(e) {
        var data = e.data;
        if (data.type === 'debug') {
            console.log("Worker Debug: " + data.data);
        }else if (data.type === 'result') {
            //console.log("Worker " + data.id + " Is Done: " + data.data);
            var callback = self.Callbacks[data.id];
            callback(data.data);
            self.doNextJob(data.id);

        }else{
            console.log("received unknown message from worker #" +  data.number );
            console.dir(data);
        }
    }

    for(var i=0; i<self.threadsNum; i++){
        self.Workers[i] = new Worker('src/Workers/Worker.js');
        self.WorkerActivity[i] = false;
        self.Workers[i].onmessage = workerCallback;
        var message = {
            type: 'setup',
            id: i
        }
        self.Workers[i].postMessage(message);
    }

    self.doNextJob = function(workerId){
        //pour avoir un accès exclusif
        self.WorkerActivity[workerId] = true;
        for(var i=0; i<10; i++){
            if(self.workPiles[i] != undefined && self.workPiles[i].length > 0){
                var task = self.workPiles[i].shift();
                    //console.log("wordker "+ workerId + " doing task on pile "+ i + ": " + task.task);
                    //console.dir(task.params);
                message = {
                    type: task.task,
                    data: task.params
                }
                self.Callbacks[workerId] = task.callback;
				//console.log(self.workPiles[i].length + " tasks left in pile " + i);
                //self.viewDuplicates();
                self.Workers[workerId].postMessage(message);
                return true;
            }
        }
        //il ne reste plus de travail
        self.WorkerActivity[workerId] = false;
        return false;
    }

    self.addTask = function(task, params, priority, callback){
        while(self.workPiles[priority] == null){
            self.workPiles.push([]);
        }
        self.workPiles[priority].push({
            task: task,
            params: params,
            callback: callback
        });
        //si il ya des worker inactif, on en assigne un à cette tâche
        for(var i=0; i<self.WorkerActivity.length; i++){
            if(self.WorkerActivity[i] == false){
                self.doNextJob(i);
                return;
            }
        }
    }

    self.removeTask = function(taskTest){
        for(var i=0; i<self.workPiles.length; i++){
            for(var j=0; j<self.workPiles[i].length; j++){
                if(taskTest(self.workPiles[i][j].params)){
                    self.workPiles[i].splice(j, 1);
                    j--;
                }
            }
        }
    }

    self.viewDuplicates = function(){
        var locationsToUpdate = [];
        var duplicates = 0;
        for(var i=0; i<10; i++){
            if(self.workPiles[i] != undefined && self.workPiles[i].length > 0){
                for(var j=0; j< self.workPiles[i].length; j++){
                    var task = self.workPiles[i][j];
                    if(task.task == "generateChunk"){
                        var location = task.params.location;
                        if(locationsToUpdate[location[0]] == null){
                            locationsToUpdate[location[0]] = [];
                        }
                        if(locationsToUpdate[location[0]][location[1]] == null){
                            locationsToUpdate[location[0]][location[1]] = [];
                        }
                        if(locationsToUpdate[location[0]][location[1]][location[2]] == null){
                            locationsToUpdate[location[0]][location[1]][location[2]] = [];
                        }
                        if(locationsToUpdate[location[0]][location[1]][location[2]][task.params.length] == null){
                            locationsToUpdate[location[0]][location[1]][location[2]][task.params.length] = true;
                        }else{
                            //console.log("duplicate: " +location + " length: " + task.params.length);
                            duplicates++;
                        }
                    }
                }
            }
        }
        //console.log("total of " + duplicates + " duplicates" );
    }
    self.cleanTasks = function(){
        var locationsToUpdate = [];
        //var duplicates = 0;
        for(var i=0; i<10; i++){
            if(self.workPiles[i] != undefined && self.workPiles[i].length > 0){
                for(var j=0; j< self.workPiles[i].length; j++){
                    var task = self.workPiles[i][j];
                    if(task.task == "generateChunk"){
                        var location = task.params.location;
                        if(locationsToUpdate[location[0]] == null){
                            locationsToUpdate[location[0]] = [];
                        }
                        if(locationsToUpdate[location[0]][location[1]] == null){
                            locationsToUpdate[location[0]][location[1]] = [];
                        }
                        if(locationsToUpdate[location[0]][location[1]][location[2]] == null){
                            locationsToUpdate[location[0]][location[1]][location[2]] = true;
                        }else{
                            //console.log("duplicate: " +location + " length: " + task.params.length);
                            self.workPiles[i].splice(j, 1);
                            j--;
                            //duplicates++;
                        }
                    }
                }
            }
        }
        //console.log("total of " + duplicates + " duplicates" );
    }


}

var Workers = new WorkersManager();
