/**
 * Camera
 * 
 * Composant permettant de voir à travers les yeux du GameObject
 */
class Camera extends Component {
    constructor(gameObject: GameObject) {
        super(gameObject);   
        gameObject.eventManager.publish(new RegisterCameraEvent(this));
    }
    
    getLocation(){
        //la position est la position du gameObject;
        var transform = <Transform>this.gameObject.components["transform"];
        return transform.location;
    }
    getRotation(){
        //la position est la position du gameObject;
        var transform = <Transform>this.gameObject.components["transform"];
        return transform.rotation;
    }
    
}