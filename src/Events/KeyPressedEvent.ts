/**
 * KeyPressedEvent
 * 
 * Un evenement permettant d'avertir lorsqu'on a appuyé sur une touche
 */
class KeyPressedEvent extends EventBase{
    constructor(public keyPressed: number, public dt: number) {
        super("KeyPressedEvent");
    }
        
    notifySubscriber(subscriber: KeyPressedSubscriber){
        //on va apeller la methode update sur l'objet qui souscrit à l'event
        subscriber.keyPressed(this.keyPressed, this.dt);
    }
}