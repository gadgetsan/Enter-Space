/**
 * Render
 * 
 * Composant permettant de donner le rendu de l'objet
 */
class Render extends Component implements RenderRequestSubscriber{
    subscriberId: number;
    shaderProgram: ShaderProgram;
    constructor(gameObject: GameObject, public mesh: Mesh, public material: Material) {
        super(gameObject);   
        this.gameObject.eventManager.subscribe(this, "RenderRequestEvent");
    }
    
    render(renderer: Renderer){
        if(this.shaderProgram == null){
            renderer.drawMesh(this);
        }else{
            renderer.drawMeshWithShader(this, this.shaderProgram);
        }
    }
    
    getLocation(){
        return this.gameObject.getLocation();
    }
}