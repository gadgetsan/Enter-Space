var Chunk = function(size, chunkStartX, chunkStartY, chunkHeight){
    //on va commencer par créer une heightmap

    var maxHeight = 10;
    this.smoothSize = size;
    this.chunkStartX = chunkStartX;
    this.chunkStartY = chunkStartY;
    this.smoothMap = null;
    this.chunkHeight = chunkHeight;



    this.GenerateSmoothMap = function(){
        precision = 1;
        var size = Math.floor(this.smoothSize / precision);
        var heightMap = [];
        for(var x=0; x<size; x++){
            heightMap.push([]);
            for(var z=0; z<size; z++){
                heightMap[x].push(this.GetHeight(x, z, precision));
            }
        }
        //console.dir(heightMap);
        var chunkTower=[];
        for(var hc=0; hc<this.chunkHeight;hc++){
            var map = [];
            for(var i = 0; i<size; i++){
                map.push([]);
                for(var j = 0; j<size; j++){
                    map[i].push([]);
                    for(var k = 0; k<size; k++){
                        if((heightMap[i][k]/precision)>((hc*size)+j)){
                            map[i][j].push(1);
                        }else{
                            map[i][j].push(0);
                        }
                    }
                }
            }
            chunkTower.push(map);
        }
        this.smoothMap = chunkTower;
    }
    //this.GenerateSmoothMap();
    this.GetHeight = function(x, z, precision){
        var actualx = (this.chunkStartX+(x*precision));
        var actualz = (this.chunkStartY+(z*precision));
        var scale = 500;
        //var heightMultiplier = PerlinNoise.noise(actualx/1000, actualz/1000, 0.5)*10;
        var height = PerlinNoise.noise(actualx/scale, actualz/scale, 0.9)*500;
        return height;

    }

    this.GetMap = function(precision, callback){
        var workerIndex = Workers.Add('MapGenerator', [precision, this.chunkStartX, this.chunkStartY, this.smoothSize, this.chunkHeight], function(result){
            callback(result);
        });
        if(this.smoothMap == null){
            if(precision == 1){
                this.GenerateSmoothMap();
                return this.smoothMap;
            }else{
                var size = Math.floor(this.smoothSize / precision);
                var heightMap = [];
                for(var x=0; x<size+1; x++){
                    heightMap.push([]);
                    for(var z=0; z<size+1; z++){
                        heightMap[x].push(this.GetHeight(x, z, precision));
                    }
                }
                //console.dir(heightMap);
                var chunkTower=[];
                for(var hc=0; hc<this.chunkHeight;hc++){
                    var map = [];
                    for(var i = 0; i<size+1; i++){
                        map.push([]);
                        for(var j = 0; j<size+1; j++){
                            map[i].push([]);
                            for(var k = 0; k<size+1; k++){
                                if((heightMap[i][k]/precision)>((hc*size)+j)){
                                    map[i][j].push(1);
                                }else{
                                    map[i][j].push(0);
                                }
                            }
                        }
                    }
                    chunkTower.push(map);
                }
                return chunkTower;
            }

        }else{
            /*
            if(precision == 1){return this.smoothMap;}
            //on regenere une autre map avec la précision recu en param
            var otherPrecisionMap = []
            for(var i = 0; i<this.smoothSize; i++){
                var oi = Math.floor(i/precision);
                otherPrecisionMap[oi] = [];
                for(var j = 0; j<this.smoothSize; j++){
                    var oj = Math.floor(j/precision);
                    otherPrecisionMap[oi][oj] = [];
                    for(var k = 0; k<this.smoothSize; k++){
                        var ok = Math.floor(k/precision);
                        otherPrecisionMap[oi][oj][ok] = this.smoothMap[i][j][k];
                    }
                }
            }

            return otherPrecisionMap;
            */

            /*

                        var workerIndex = Workers.Add('MapGenerator', [precision, this.chunkStartX, this.chunkStartY, this.smoothSize, this.chunkHeight], function(result){
                            callback(result);
                        });
                */

                var workerIndex = Workers.Add('MapGenerator', [precision, this.chunkStartX, this.chunkStartY, this.smoothSize, this.chunkHeight], function(result){
                    callback(result);
                });
                var size = Math.floor(this.smoothSize / precision);
                var heightMap = [];
                for(var x=0; x<size+1; x++){
                    heightMap.push([]);
                    for(var z=0; z<size+1; z++){
                        heightMap[x].push(this.GetHeight(x, z, precision));
                    }
                }
                //console.dir(heightMap);
                var chunkTower=[];
                for(var hc=0; hc<this.chunkHeight;hc++){
                    var map = [];
                    for(var i = 0; i<size+1; i++){
                        map.push([]);
                        for(var j = 0; j<size+1; j++){
                            map[i].push([]);
                            for(var k = 0; k<size+1; k++){
                                if((heightMap[i][k]/precision)>((hc*size)+j)){
                                    map[i][j].push(1);
                                }else{
                                    map[i][j].push(0);
                                }
                            }
                        }
                    }
                    chunkTower.push(map);
                }
                return chunkTower;
        }

    }

}
