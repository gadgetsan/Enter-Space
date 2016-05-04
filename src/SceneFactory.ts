/**
 * SceneFactory
 * 
 * Cette classe permet de créer une Scène
 */
class SceneFactory {
    constructor() {        
    }
    
    get(sceneType: string){
        //on va créé un Manager d'event uniquement pour cette scène la
        var eventManager = new EventManager();
        if(sceneType == null){
            return new Scene(eventManager);
        }
    }
}