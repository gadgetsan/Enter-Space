/**
 * MouseMovedEvent
 * 
 * Un evenement permettant d'avertir lorsque l'utilisateur bouge la souris
 */
class MouseMovedEvent extends EventBase{
    constructor(public event: MouseEvent) {
        super("MouseMovedEvent");
    }
        
    notifySubscriber(subscriber: MouseMovedSubscriber){
        //on va apeller la methode update sur l'objet qui souscrit à l'event
        subscriber.mouseMoved(this.event);
    }
}