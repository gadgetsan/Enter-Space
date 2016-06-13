/**
 * RenderManager
 * 
 * Un gestionnaire des plusieurs phases de rendu (si il y en as)
 * 
 */
class RenderManager implements RegisterRendererSubscriber {
    
    subscriberId: number;
    mainRenderer: Renderer;
    
    renderers: Array<Renderer>;
    
    constructor(public eventManager: EventManager, mainShader: ShaderProgram) {
        this.mainRenderer = new Renderer(eventManager);
        this.eventManager.subscribe(this, "RegisterRendererEvent");
        this.mainRenderer.setShader(mainShader);
        this.renderers = Array();
    }
    
    registerRenderer(renderer: Renderer){
        this.renderers.push(renderer);
    }
    
    render(scene: Scene){        
        //console.log("rendering with main renderer");
        //console.log("rendering with other renderers");
        //on roule la requête de rendu pour chaque element pour chaque renderer        
        this.renderers.forEach(renderer=>{
            renderer.startRender();
            //this.eventManager.publish(new RenderRequestEvent(renderer));   
            scene.gameObjects.forEach(go =>{
                this.renderGameObject(go, renderer);
            })
            //pour chaque Gameobject de la scène, on render lui et ses enfants 
            renderer.doneRendering();
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        })    
        
        this.mainRenderer.startRender();
        //this.eventManager.publish(new RenderRequestEvent(this.mainRenderer));        
        scene.gameObjects.forEach(go =>{
            this.renderGameObject(go, this.mainRenderer);
        })
        this.mainRenderer.doneRendering();
        
    }
    
    //methode recursive pour rendre un objet et ses enfants
    renderGameObject(gameObject: GameObject, renderer: Renderer){
        if(gameObject.components["render"] != null){
            var render = <Render>gameObject.components["render"];
            render.render(renderer);
        }
        
        //ensuite si l'objet parent, à des enfants (avec un composant render) on les render
        if(gameObject.children != null && gameObject.children.length > 0){
            gameObject.children.forEach(child =>{
                this.renderGameObject(child, renderer);              
            })
            
        }
    }
}