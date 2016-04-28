/**
 * GameObject
 */
class GameObject {
    renderable: Renderable;
    children: Array<GameObject>;
    mass: number;
    velocity: GLM.IArray;
    location: GLM.IArray;
    canCollide: boolean;
    isColliding: boolean;
    constructor() {        
        this.velocity = vec3.create();
        this.location = vec3.create();
    }
    
    add(child: GameObject){
        this.children.push(child);
    }
    
    updatePosition(newLocation){
        var delta = [];
        vec3.sub(delta, newLocation, this.location);
        this.location = newLocation;
        mat4.translate(this.renderable.mvMatrix, this.renderable.mvMatrix, delta);
    }
    
    updateDownDirection(newDown){
        //TODO: IMPLEMENT!?
    }
    
    update(dt: number){
        console.log(`${Utils.getClassName(this)} Location: ${this.location}, Displacement: ${this.renderable? this.renderable.offset: ""}`)
        //on met à jour la position avec la vitesse
        var displacement = [];
        vec3.scale(displacement, this.velocity, dt/1000);
        vec3.add(this.location, this.location, displacement);
        
        //si on a un renderable, on doit aussi mettre à jour sa position
        if(this.renderable){
            //on reset les informations
            mat4.translate(this.renderable.mvMatrix, this.renderable.mvMatrix, displacement);
        }
        if(this.children != null){            
            this.children.forEach(child =>{
                child.update(dt);
            })
        }
    }
    
    cameraMoved(move: Array<number>, camera: Camera){
        //LOD pour un objet??
    }
}