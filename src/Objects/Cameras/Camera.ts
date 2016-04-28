/**
 * Camera
 */
class Camera {
    mvMatrix: GLM.IArray;
    position: GLM.IArray;
    rotationMatrix: GLM.IArray;
    up: Array<number>;
    subscribers: Array<GameObject>;
    
    constructor() {
        this.mvMatrix = mat4.create();
        this.position = vec3.create();
        this.rotationMatrix = mat4.create();
        
        vec3.add(this.position, this.position, [0.0, 0.0, 0.0]);
        this.up = [0,1,0];
        this.updateMV([0,0,0]);
        this.subscribers = [];       
        
    }
    
    updateMV(movement: Array<number>){        
        //On recréé notre matrice de transformation à partir de notre quaternion
        //@MVMatrix = @RotationMatrix #mat4.fromQuat(@MVMatrix, @Quaternion)
        mat4.identity(this.mvMatrix);
        mat4.multiply(this.mvMatrix, this.mvMatrix, this.rotationMatrix);
        
        //Ensuite, on transforme notre déplacement pour qu'il soit dans le même plan que notre camera
        var invertedRotation = mat4.create();
        mat4.invert(invertedRotation, this.rotationMatrix);
        vec3.transformMat4(movement, movement, invertedRotation);
        vec3.add(this.position, this.position, movement);
        mat4.translate(this.mvMatrix, this.mvMatrix, this.position);
        
        //ensuite, on retourne le déplacement inversé parce que la camera vois tout inversé...
        var inverted = vec3.create();
        vec3.subtract(inverted, inverted, movement);
        if(movement != [0,0,0]){
            //this.notify("move", inverted);
        }
        return inverted;
    }
    
    changeDownDirection(down: Array<number>){
        //on trouve le up à partir du down
        var newUp = [0,0,0];
        vec3.sub(newUp, newUp, down);
        
        //ensuite, on trouve le vecteur de rotation
        var rotationAxis = [0,0,0];
        var normNew = [];
        vec3.normalize(normNew, newUp);
        var normOld = [];
        vec3.normalize(normOld, this.up);
        vec3.cross(rotationAxis, normNew, normOld);
        
        //finalement, on trouve l'angle entre les deux vecteurs
        var angle = Math.acos(vec3.dot(normNew, normOld));
        
        //et on effectue le rotation
        mat4.rotate(this.rotationMatrix, this.rotationMatrix, angle, rotationAxis);
        
        this.up = normNew;
    }
    /*
    subscribe(to, cb){
        this.subscribers.push({type: to, callback: cb});
    }
    
    notify(type, item){
        if(this.subscribers){
            this.subscribers.forEach(subscriber => {
                if(subscriber.type == type){
                    subscriber.callback(item, this);
                }
            });
        }
    }
    */
    turnLeftDeg(deg: number){
        mat4.rotateY(this.rotationMatrix, this.rotationMatrix, -Geo.degToRad(deg));
        this.updateMV([0,0,0]);
    }
    
    turnRightDeg(deg: number){
        mat4.rotateY(this.rotationMatrix, this.rotationMatrix, Geo.degToRad(deg));
        this.updateMV([0,0,0]);
    }
    
    moveLeft(dist: number){
        return this.updateMV([dist, 0, 0]);
    }
    
    moveRight(dist: number){
        return this.updateMV([-dist, 0, 0]);
    }
    
    moveForward(dist: number){
        return this.updateMV([0, 0, dist]);
    }
    
    moveBackward(dist: number){
        return this.updateMV([0, 0, -dist]);
    }
    
    moveUp(dist: number){
        return this.updateMV([0, -dist, 0]);
    }
    
    moveDown(dist: number){
        return this.updateMV([0, dist, 0]);
    }
}