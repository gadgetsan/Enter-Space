/**
 * GameObject
 */
class GameObject {
    
    components: Array<Component>;    
    
    constructor(public eventManager: EventManager) {    
        this.components = new Array();    
    }
    
   moveTo(newLocation: GLM.IArray){
       if(!this.components["transform"]){
           console.error("this GameObject cannot be moved because it does not have a Transform Component");
       }else{           
        (<Transform>this.components["transform"]).location = newLocation;
        //TODO: avertir les autres components que la transform a changé
       }
   }
   
   getLocation(){       
       if(!this.components["transform"]){
           console.error("this GameObject does not have a location because it does not have a transform component");
       }else{           
        return (<Transform>this.components["transform"]).location;
       }
   }
}