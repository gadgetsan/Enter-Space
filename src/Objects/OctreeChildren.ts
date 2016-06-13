/**
 * OctreeChildren
 * 
 * Une classe permetant d'avoir une implementation différente pour les enfants d'un octree...
 */
class OctreeChildren extends OctreeObject {
    location: GLM.IArray;
    size: number;
    
    constructor(eventManager: EventManager) {
        super(eventManager);
        this.location = vec3.create();
        this.size = 1.0;
    }
    
    moveTo(newLocation: GLM.IArray){
       this.location = newLocation;
   } 
   changeSize(newSize: number){
       this.size = newSize;
   }
   
   getLocation(){
       return this.location;
   }
   
   getSize(){
       return this.size;
   }
   
   createMesh(){
       
   }
}