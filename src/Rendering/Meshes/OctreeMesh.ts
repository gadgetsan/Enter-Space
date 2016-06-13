/**
 * OctreeMesh
 * 
 * Objet definissant comment afficher un Octree
 */
class OctreeMesh extends Mesh{
    staticLocationBuffer: VertexLocationBuffer;
    staticIndexBuffer: VertexIndexBuffer;
    staticNormalBuffer: VertexNormalBuffer;
    vertices: number[];
    indices: number[];
    normals: number[];
    lastIndex: number;
    constructor(octree: OctreeObject){
        super();
        //si les buffer statique sont déjà défini, on ne les redéfini pas
        this.drawingType = GL.TRIANGLES;
        this.lastIndex = 0;
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        octree.children.forEach(child =>{
            this.addDataForOctree(<OctreeChildren>child);
        })
        
        //on va créer ses Buffer
        this.staticLocationBuffer = new VertexLocationBuffer(this.vertices);
        this.staticIndexBuffer = new VertexIndexBuffer(this.indices);
        this.staticNormalBuffer = new VertexNormalBuffer(this.normals);
    }
    
    addDataForOctree(octree: OctreeChildren){        ;
        
        if(octree.children != null && octree.children.length > 0){
            octree.children.forEach(child =>{
                this.addDataForOctree(<OctreeChildren>child);
            });
        }else if(octree.value != 0){
            var loc = octree.location;
            var size = octree.size;
            var hSize = size/2.0;
            this.vertices = this.vertices.concat([
                //FRONT FACE
                loc[0]-hSize, loc[1]-hSize,  loc[2]+hSize,
                loc[0]+hSize, loc[1]-hSize,  loc[2]+hSize,
                loc[0]+hSize, loc[1]+hSize,  loc[2]+hSize,
                loc[0]-hSize, loc[1]+hSize,  loc[2]+hSize,

                // Back face
                loc[0]-hSize, loc[1]-hSize,  loc[2]-hSize,
                loc[0]-hSize, loc[1]+hSize,  loc[2]-hSize,
                loc[0]+hSize, loc[1]+hSize,  loc[2]-hSize,
                loc[0]+hSize, loc[1]-hSize,  loc[2]-hSize,

                // Top face
                loc[0]-hSize, loc[1]+hSize,  loc[2]-hSize,
                loc[0]-hSize, loc[1]+hSize,  loc[2]+hSize,
                loc[0]+hSize, loc[1]+hSize,  loc[2]+hSize,
                loc[0]+hSize, loc[1]+hSize,  loc[2]-hSize,

                // Bottom face
                loc[0]-hSize, loc[1]-hSize,  loc[2]-hSize,
                loc[0]+hSize, loc[1]-hSize,  loc[2]-hSize,
                loc[0]+hSize, loc[1]-hSize,  loc[2]+hSize,
                loc[0]-hSize, loc[1]-hSize,  loc[2]+hSize,

                // Right face
                loc[0]+hSize, loc[1]-hSize,  loc[2]-hSize,
                loc[0]+hSize, loc[1]+hSize,  loc[2]-hSize,
                loc[0]+hSize, loc[1]+hSize,  loc[2]+hSize,
                loc[0]+hSize, loc[1]-hSize,  loc[2]+hSize,

                // Left face
                loc[0]-hSize, loc[1]-hSize,  loc[2]-hSize,
                loc[0]-hSize, loc[1]-hSize,  loc[2]+hSize,
                loc[0]-hSize, loc[1]+hSize,  loc[2]+hSize,
                loc[0]-hSize, loc[1]+hSize,  loc[2]-hSize,
            ]);
            
            this.normals = this.normals.concat([
                // Front face
                0.0,  0.0,  1.0,
                0.0,  0.0,  1.0,
                0.0,  0.0,  1.0,
                0.0,  0.0,  1.0,

                // Back face
                0.0,  0.0, -1.0,
                0.0,  0.0, -1.0,
                0.0,  0.0, -1.0,
                0.0,  0.0, -1.0,

                // Top face
                0.0,  1.0,  0.0,
                0.0,  1.0,  0.0,
                0.0,  1.0,  0.0,
                0.0,  1.0,  0.0,

                // Bottom face
                0.0, -1.0,  0.0,
                0.0, -1.0,  0.0,
                0.0, -1.0,  0.0,
                0.0, -1.0,  0.0,

                // Right face
                1.0,  0.0,  0.0,
                1.0,  0.0,  0.0,
                1.0,  0.0,  0.0,
                1.0,  0.0,  0.0,

                // Left face
                -1.0,  0.0,  0.0,
                -1.0,  0.0,  0.0,
                -1.0,  0.0,  0.0,
                -1.0,  0.0,  0.0
            ]);
            
            this.indices = this.indices.concat([
                this.lastIndex, this.lastIndex+1, this.lastIndex+2,
                this.lastIndex, this.lastIndex+2, this.lastIndex+3,

                this.lastIndex+4, this.lastIndex+5, this.lastIndex+6,
                this.lastIndex+4, this.lastIndex+6, this.lastIndex+7,

                this.lastIndex+8, this.lastIndex+9, this.lastIndex+10,
                this.lastIndex+8, this.lastIndex+10, this.lastIndex+11,

                this.lastIndex+12, this.lastIndex+13, this.lastIndex+14,
                this.lastIndex+12, this.lastIndex+14, this.lastIndex+15,

                this.lastIndex+16, this.lastIndex+17, this.lastIndex+18,
                this.lastIndex+16, this.lastIndex+18, this.lastIndex+19,

                this.lastIndex+20, this.lastIndex+21, this.lastIndex+22,
                this.lastIndex+20, this.lastIndex+22, this.lastIndex+23
            ]);
            this.lastIndex += 8;
        }
        
    }
    
    getPositionBuffer(){
        return this.staticLocationBuffer;
    }
    
    getNormalBuffer(){
        return this.staticNormalBuffer;
    }  
    
    getIndexBuffer(){
        return this.staticIndexBuffer;
    }    
    
    getVertexCount(){
        return this.staticLocationBuffer.data.length;
    }
}