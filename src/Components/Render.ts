/**
 * Render
 * 
 * Composant permettant de donner le rendu de l'objet
 */
class Render extends Component implements RenderRequestSubscriber{
    subscriberId: number;
    constructor(gameObject: GameObject, public mesh: Mesh, public material: Material) {
        super(gameObject);   
        this.gameObject.eventManager.subscribe(this, "RenderRequestEvent");
    }
    
    render(renderer: Renderer){
        renderer.drawMesh(this);
    }
    
    getLocation(){
        return this.gameObject.getLocation();
    }
}