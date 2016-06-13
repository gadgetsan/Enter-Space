/**
 * Render
 * 
 * Composant permettant de donner le rendu de l'objet
 */
class Render extends Component{
    subscriberId: number;
    shaderProgram: ShaderProgram;
    constructor(gameObject: GameObject, public mesh: Mesh, public material: Material) {
        super(gameObject);   
        this.gameObject.eventManager.subscribe(this, "RenderRequestEvent");
    }
    
    render(renderer: Renderer){
        //console.log("Rendering " + this.gameObject.name)
        if(this.shaderProgram == null){
            renderer.drawMesh(this);
        }else{
            renderer.drawMeshWithShader(this, this.shaderProgram);
        }       
        
    }
    
    getLocation(){
        return this.gameObject.getLocation();
    }
    
    getSize(){
        return this.gameObject.getSize();
    }
    
    changeColor(colorR: number, colorG: number, colorB: number){
        this.material = new UniformMaterial([colorR, colorG, colorB, 1.0], this.mesh.getVertexCount());
    }
}