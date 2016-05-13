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
        console.log("Rendering " + this.gameObject.name)
        if(this.shaderProgram == null){
            renderer.drawMesh(this);
        }else{
            renderer.drawMeshWithShader(this, this.shaderProgram);
        }
    }
    
    getLocation(){
        return this.gameObject.getLocation();
    }
    
    //pour déterminer si on affiche dans le rendu de picking
    isPickable(){
        //TODO: aller voir si l'object parent a un composant permettant d'être sélectionné
        return true;
    }
}