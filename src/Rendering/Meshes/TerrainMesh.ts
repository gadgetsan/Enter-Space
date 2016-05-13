/**
 * TerrainMesh
 * 
 * Objet definissant comment afficher un terrain
 */
class TerrainMesh extends Mesh{
    vertexCount: number;
    constructor(){
        super();
        //si les buffer statique sont déjà défini, on ne les redéfini pas
        this.drawingType = GL.TRIANGLE_STRIP;
        var size = 100.0;
        var blockNum = 100;
        var blockSize = size/blockNum;
        this.vertexCount = (blockNum+1)*(blockNum+1);
        
        var vertices = [];        
        
        for(var i=0; i<=blockNum; i++){
            var valX = i*blockSize-(size/2);
            for(var j=0; j<=blockNum; j++){
                var valY = j*blockSize-(size/2);
                vertices.push(valX);
                vertices.push(0);
                vertices.push(valY);
            } 
        }
        
        var vertexBySize = blockNum+1;
        var indices = [];
        var nextIndexAdd = vertexBySize;
        var currentIndex = 0;
        var valueAdded = blockNum-1;
        for(var lineNum = 0; lineNum < blockNum; lineNum++){
            //console.log("Ligne "+ lineNum);
            //pour chaque Ligne
            if(lineNum %2 == 0){
                //ligne paire
                var nextAdd = vertexBySize;
                var lastValue = lineNum*(vertexBySize);
                for(var i=lineNum*(vertexBySize); i<(lineNum*(vertexBySize))+(vertexBySize)*2; i++){        
                    //console.log(lastValue);            
                    indices.push(lastValue);
                    lastValue += nextAdd;
                    if(nextAdd == vertexBySize){
                        nextAdd = -(vertexBySize-1);
                    }else{
                        nextAdd = vertexBySize;
                    }
                }
            }else{
                //ligne impaire
                var nextAdd = vertexBySize;
                var lastValue = (Math.ceil(lineNum/2)*vertexBySize*2)-1;
                for(var i=lineNum*(vertexBySize); i<(lineNum*(vertexBySize))+(vertexBySize)*2; i++){        
                    //console.log(lastValue);            
                    indices.push(lastValue);
                    lastValue += nextAdd;
                    if(nextAdd == vertexBySize){
                        nextAdd = -(vertexBySize+1);
                    }else{
                        nextAdd = vertexBySize;
                    }
                }
            }
        }
        
        //console.dir(indices);  
        //console.dir(vertices);  
        
        
        //on va créer ses Buffer
        this.vertexLocationBuffer = new VertexLocationBuffer(vertices);
        this.vertexIndexBuffer = new VertexIndexBuffer(indices);
    }
    
    getVertexCount(){
        return this.vertexCount;
    }
}