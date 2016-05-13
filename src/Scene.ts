/**
 * Scene
 * 
 * Objet Contenant tout les objets, il s'occuperas de dispatcher les evènements à travers la hierarchie d'objets
 */
class Scene {
    renderManager: RenderManager;
    keyboardManager: KeyboardManager;
    mouseManager: MouseManager;
    
    gameObjects: Array<GameObject>;
    
    grid: Grid;
    
    gameObjectFactory: GameObjectFactory;
    
    constructor(public eventManager: EventManager) { 
        this.renderManager = new RenderManager(this.eventManager, new ShaderProgram(new VertexBasic(), new FragmentBasic()));
        this.keyboardManager = new KeyboardManager(this.eventManager);
        this.mouseManager = new MouseManager(this.eventManager);   
        this.gameObjectFactory = new GameObjectFactory(this.eventManager);
        
        //Setup Initial pour la grille
        this.gameObjects = [];
        
        this.addGameObject(this.gameObjectFactory.get("Player"));        
        this.addGameObject(this.gameObjectFactory.get("Cube"));
        //on va créer une 'grille' de cubes
        /*
        var sideCount = 5;
        for(var i=-sideCount; i<sideCount;i++){
           for(var j=-sideCount; j<sideCount;j++){
                var cube = this.gameObjectFactory.get("Cube");
                cube.moveTo([(2*i), -2.0, (2*j)]);
                this.addGameObject(cube);
            } 
        }
        */ 
        var ground = this.gameObjectFactory.get("Ground");
        ground.moveTo([0, -2.0, 0]);
        this.addGameObject(ground);
        
        
        var ressource = this.gameObjectFactory.get("Ressource");
        ressource.moveTo([-4.0, -2.5, 0]);
        this.addGameObject(ressource);
        
        
    }
    
    addGameObject(object: GameObject){
        this.gameObjects.push(object);
    }
    
    update(dt: number){
        this.keyboardManager.sendEvents(dt);
        this.eventManager.publish(new UpdateRequestEvent(dt));
    }
    
    render(){
        this.renderManager.render();
    }
    
    getTargetedGameObject(location: GLM.IArray, direction: GLM.IArray){
        
    }
    
    
}