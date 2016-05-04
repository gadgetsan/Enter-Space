/**
 * UpdateRequestEvent
 * 
 * un évènement de demande de mise à jour
 */
class UpdateRequestEvent extends EventBase{
    constructor(public dt: number) {
        super("UpdateRequestEvent");
    }
    
    
    notifySubscriber(subscriber: UpdateRequestSubscriber){
        //on va apeller la methode update sur l'objet qui souscrit à l'event
        subscriber.update(this.dt);
    }
}