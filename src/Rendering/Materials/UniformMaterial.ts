/**
 * UniformMaterial
 */
class UniformMaterial extends Material {
    constructor(public color: Array<number>, public vertexCount: number) {
        super();
        if(this.color == null){            
            this.color = [1.0, 1.0, 1.0, 1.0];
        }
        var data = [];
        for(var i=0; i<vertexCount; i++){
            for(var j=0; j<4; j++){
                data.push(this.color[j]);
            }
        }
        this.vertexColorBuffer = new VertexColorBuffer(data);
    }    
}