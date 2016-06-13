/**
 * Mesh
 * 
 * Objet de base permettant de définir le mesh d'un objet
 */
class Mesh {
    vertexLocationBuffer: VertexLocationBuffer;
    vertexIndexBuffer: VertexIndexBuffer;
    vertexNormalBuffer: VertexNormalBuffer;
    drawingType: number;
    
    constructor() {         
    }
    
    getPositionBuffer(){
        return this.vertexLocationBuffer;
    }
    
    getNormalBuffer(){
        return this.vertexNormalBuffer;
    }
    
    getIndexBuffer(){
        return this.vertexIndexBuffer;
    }    
    
    getVertexCount(){
        return this.vertexLocationBuffer.data.length;
    }
}