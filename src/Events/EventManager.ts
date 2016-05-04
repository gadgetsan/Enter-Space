/**
 * EventManager
 * 
 * Objet permettant de redistribuer des évènements aux personnes intéressés
 */
class EventManager {
    
    subscribers: Array<Array<Subscriber>>
    nextSubscriberId: number;
    
    constructor() {
        this.subscribers = new Array();
        this. nextSubscriberId = 0;
    }
    
    subscribe(subscriber: Subscriber, eventName: string){        
        //TODO: corriger le subscriber id qui ne fonctionne pas si on s'abonne à plusieurs events
        subscriber.subscriberId = this.nextSubscriberId;
        this.nextSubscriberId++;
        if(this.subscribers[eventName] == null){
            this.subscribers[eventName] = new Array();
        }      
        this.subscribers[eventName][subscriber.subscriberId] = subscriber;
    }
    
    publish(event: EventBase){
        var eventName = event.typeName;
        if(this.subscribers[eventName] != null){
            this.subscribers[eventName].forEach(subscriber =>{
                event.notifySubscriber(subscriber);
            })
        }
        
    }
}