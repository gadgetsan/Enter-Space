/**
 * Ground
 */
class Ground extends GameObject implements UpdateRequestSubscriber{
    subscriberId: number;
    constructor(eventManager: EventManager) {
        super(eventManager);
        //on s'abonne aux évènements qui nous importe
        this.eventManager.subscribe(this, "UpdateRequestEvent");
        
        //on créé nos composants pour le rendu
        this.components["transform"] = new Transform(this, vec3.create(), mat4.create(), 1.0);
        var terrainMesh = new TerrainMesh();
        var render = new Render(this, terrainMesh, new UniformMaterial([0.45098, 0.6784, 0.3686], terrainMesh.getVertexCount()));
        var terrainShaderProgram = new ShaderProgram(new VertexTerrain(), new FragmentBasic());
        this.eventManager.publish(new RegisterShaderEvent(terrainShaderProgram));
        render.shaderProgram = terrainShaderProgram;
        this.components["render"] = render;
        
    }
    
    update(dt: number){       
    }
}