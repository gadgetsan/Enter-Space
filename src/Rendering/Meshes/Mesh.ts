/**
 * Mesh
 * 
 * Objet de base permettant de définir le mesh d'un objet
 */
class Mesh {
    vertexLocationBuffer: VertexLocationBuffer;
    vertexIndexBuffer: VertexIndexBuffer;
    drawingType: number;
    
    constructor() {         
    }
    
    getPositionBuffer(){
        return this.vertexLocationBuffer;
    }
    
    getIndexBuffer(){
        return this.vertexIndexBuffer;
    }    
    
    getVertexCount(){
        return this.vertexLocationBuffer.data.length;
    }
}