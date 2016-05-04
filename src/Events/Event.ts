/**
 * Event
 * 
 * classe de basse pour les évènements
 */
class EventBase {
    constructor(public typeName: string) {
    }
    
    notifySubscriber(subscriber: Subscriber){
        //en fait cet evenement ne fait rien...
    }
}