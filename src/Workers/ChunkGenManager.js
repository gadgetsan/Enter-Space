ChunkGen = function(){
    var self = this;
    /*
    for(var i=0; i< 100;i++){
        Workers.addTask('hello', 'ceci est un message', 1, function(result){
            console.log("I received " + result + " Back from the job for the "+ i +" th time");
        })
    }
*/


    

    this.UpdateChunk = function(chunkIndex, chunkSize, chunkLength){
        var params = [chunkIndex, chunkSize, chunkLength];
        var message = {
            type: 'update',
            data: params
        }
        //this.Worker.postMessage(message);
    }

    this.modifyChunk = function(x, y, z, blockSize, type){
        var params = [[x, y, z], blockSize, type];
        var message = {
            type: 'modify',
            data: params
        }
        //this.Worker.postMessage(message);
    }
}
