/**
 * MouseClickedEvent
 * 
 * Un evenement permettant d'avertir lorsque l'utilisateur bouge la souris
 */
class MouseClickedEvent extends EventBase{
    constructor(public event: MouseEvent) {
        super("MouseClickedEvent");
    }
        
    notifySubscriber(subscriber: MouseClickedSubscriber){
        //on va apeller la methode update sur l'objet qui souscrit à l'event
        subscriber.mouseClicked(this.event);
    }
}