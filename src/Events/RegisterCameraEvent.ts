/**
 * RegisterCameraEvent
 * 
 * Un evenement permettant d'avertir que l'ont veux ajouter une nouvelle Camera
 */
class RegisterCameraEvent extends EventBase{
    constructor(public camera: Camera) {
        super("RegisterCameraEvent");
    }
        
    notifySubscriber(subscriber: RegisterCameraSubscriber){
        //on va apeller la methode update sur l'objet qui souscrit à l'event
        subscriber.registerCamera(this.camera);
    }
}