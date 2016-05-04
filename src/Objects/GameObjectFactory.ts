/**
 * GameObjectFactory
 */
class GameObjectFactory {
    constructor(public eventManager: EventManager) {
        
    }
    
    get(objectType: string){
        if(objectType == null){
            return new Cube(this.eventManager);
        }else{
            var gameObject = Object.create(window[objectType].prototype);
            gameObject.constructor.apply(gameObject, [this.eventManager]);
            return gameObject;
        }
    }
}