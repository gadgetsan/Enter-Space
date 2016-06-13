/**
 * Material
 * 
 * une classe permettant de définir un material qui sera utiliser pour rendre un Mesh
 */
class Material {
    
    vertexColorBuffer: VertexColorBuffer;
    constructor() {
        
    }
    
    getColorBuffer(){
        return this.vertexColorBuffer;
    }
    
    changeColor(){
        
    }
}