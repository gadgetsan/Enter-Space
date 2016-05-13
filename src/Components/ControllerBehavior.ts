/**
 * ControllerBehavior
 * 
 * Composant permettant de controller l'objet à partir du clavier
 */
class ControllerBehavior extends Component implements KeyPressedSubscriber, MouseMovedSubscriber, MouseClickedSubscriber{
    subscriberId: number;
    moveSpeed: number;
    rotateSpeed: number;
    up: GLM.IArray;
    forward: GLM.IArray;
    left: GLM.IArray;
    phi: number;
    theta: number;
    constructor(gameObject: GameObject) {
        super(gameObject); 
        this.moveSpeed = 0.01;  
        this.rotateSpeed = 0.01;  
        this.up = [0, 1, 0];
        this.phi = -Math.PI/2;
        this.theta = Math.PI/2;
        this.forward = [0, 0, 1];
        this.left = [1, 0, 0];
        this.gameObject.eventManager.subscribe(this, "KeyPressedEvent");
        this.gameObject.eventManager.subscribe(this, "MouseMovedEvent");
        this.gameObject.eventManager.subscribe(this, "MouseClickedEvent");
    }
    
    keyPressed(key: number, dt: number){
        var transform = <Transform>this.gameObject.components["transform"];
        var movement = vec3.create();
        switch (key)
        {
            case KeyCode.KEY_W :
                vec3.sub(movement, movement, this.forward);
                break;
            case KeyCode.KEY_S :
                vec3.add(movement, movement, this.forward);
                break;
            case KeyCode.KEY_A :
                vec3.add(movement, movement, this.left);
                break;
            case KeyCode.KEY_D :
                vec3.sub(movement, movement, this.left);
                break;
        }
        
        //on va multiplié le mouvement par la vitesse
        vec3.scale(movement, movement, this.moveSpeed*dt);
        vec3.add(transform.location, transform.location, movement);
    }
    
    mouseClicked(event: MouseEvent){
        //TODO: sélectionner l'item clické
    }
    
    mouseMoved(event: MouseEvent){
        var moveX = this.rotateSpeed*event.movementX;
        var moveY = this.rotateSpeed*event.movementY;      
        //console.dir(this.gameObject);
        var transform = <Transform>this.gameObject.components["transform"];          
        
        this.phi -= moveY;
        if(this.phi < -Math.PI){
            this.phi = -Math.PI;
        }
        if(this.phi > 0){
            this.phi = 0;
        }
        this.theta += moveX;
        //console.log(`Theta: ${this.theta}, Phi: ${this.phi}`)
        //on va trouver le point du lookat
        var lookAt = vec3.create();
        lookAt[0] = Math.sin(this.phi)*Math.cos(this.theta);
        lookAt[1] = Math.cos(this.phi);
        lookAt[2] = Math.sin(this.phi)*Math.sin(this.theta);
        
        this.forward = lookAt;
        vec3.cross(this.left, this.forward, this.up);
        
        mat4.lookAt(transform.rotation, vec3.create(), lookAt, this.up);
    }
}