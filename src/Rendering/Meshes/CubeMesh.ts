/**
 * CubeMesh
 * 
 * Objet definissant comment afficher un Cube
 */
class CubeMesh extends Mesh{
    static staticLocationBuffer: VertexLocationBuffer;
    static staticIndexBuffer: VertexIndexBuffer;
    constructor(){
        super();
        //si les buffer statique sont déjà défini, on ne les redéfini pas
        this.drawingType = GL.TRIANGLES;
        if(CubeMesh.staticLocationBuffer != null){
            return;
        }
        var vertices = [
            -1.0, -1.0,  -1.0,
            -1.0,  1.0,  -1.0,
            1.0,  1.0,  -1.0,
            1.0, -1.0,  -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0
        ];
        
        var indices = [
            0,1,2,
            2,3,0,

            0,1,5,
            5,4,0,

            1,2,6,
            6,5,1,

            2,3,7,
            7,6,2,

            3,0,4,
            4,7,3,

            4,5,6,
            6,7,4
        ];
        
        //on va créer ses Buffer
        CubeMesh.staticLocationBuffer = new VertexLocationBuffer(vertices);
        CubeMesh.staticIndexBuffer = new VertexIndexBuffer(indices);
    }
    
    getPositionBuffer(){
        return CubeMesh.staticLocationBuffer;
    }
    
    getIndexBuffer(){
        return CubeMesh.staticIndexBuffer;
    }    
    
    getVertexCount(){
        return CubeMesh.staticLocationBuffer.data.length;
    }
}