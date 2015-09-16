var Workers = new function(){
    this.List = [];
    this.Add = function(functionName, params, callback){
        var length = this.List.length;
        var worker = new Worker('src/Workers/' + functionName + '.js');
        worker.onmessage = function(e) {
            var data = e.data;
            if (data.type === 'debug') {
                console.log("Thread #" + length + " for " + functionName + " DEBUG: " + data.data);
            }else if (data.type === 'result') {
                callback(data.data)
            }else{
                console.log("received unknown message from worker #" + length);
                console.dir(data);
            }
        }
        worker.postMessage(params)
        this.List.push(worker);
        return length;
    }

}
